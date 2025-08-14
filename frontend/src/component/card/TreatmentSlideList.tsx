import React, { useRef, useEffect, useState, useMemo } from 'react'
import TreatmentSlideCard from '@/component/card/TreatmentSlideCard'
import { getVetTreatments, getVetTreatmentDetail } from '@/services/api/Vet/vettreatment'
import type { VetTreatment } from '@/types/Vet/vettreatmentType'
import { toTimeRange } from '@/utils/timeMapping'
import { subjectMapping } from '@/utils/subjectMapping'
import { speciesMapping } from '@/utils/speciesMapping'

const CARD_HEIGHT = 96
const OVERLAP = 40
const SNAP_GAP = CARD_HEIGHT - OVERLAP
const MIN_CONTAINER_SCROLL_HEIGHT = 600

type CardRow = {
  id: number
  department: string
  petName: string
  petInfo: string
  time: string
  is_signed: boolean
}

interface Props {
  /** 외부에서 가공해 준 리스트(있으면 이걸 그대로 렌더) */
  data?: VetTreatment[]
  /** 외부 로딩 상태(외부 데이터 줄 때만 의미 있음) */
  loading?: boolean
  onCardClick?: (id: number) => void
}

/** ✅ AI 요약 존재 여부 판별(여러 키 대응) — 내부 fetch 분기에서만 사용 */
const hasAiSummary = (t: any): boolean => {
  const cand =
    t.aiSummary ?? t.ai_summary ?? t.summary?.ai ?? t.summary?.aiSummary ??
    t.summaryText ?? t.summary_text ?? t.aiNote ?? t.ai_note
  if (cand == null) return false
  if (typeof cand === 'string') return cand.trim().length > 0
  if (Array.isArray(cand)) return cand.some((x) => String(x ?? '').trim().length > 0)
  if (typeof cand === 'object') return Object.values(cand).some((v) => String(v ?? '').trim().length > 0)
  return false
}

const TreatmentSlideList = ({ data, loading, onCardClick }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [focusedIndex, setFocusedIndex] = useState(0)

  // 외부 제어 여부
  const controlled = data !== undefined

  // 렌더용 카드 데이터
  const [cards, setCards] = useState<CardRow[]>([])
  const [internalLoading, setInternalLoading] = useState(false)

  // 스크롤 포커스(애니메이션)
  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const handleScroll = () => setFocusedIndex(Math.round(container.scrollTop / SNAP_GAP))
    container.addEventListener('scroll', handleScroll)
    return () => container.removeEventListener('scroll', handleScroll)
  }, [])

  // 공통: VetTreatment[] -> CardRow[] 매핑(정렬은 “들어온 순서” 유지)
  const mapToRows = (list: any[]): CardRow[] =>
    (list || []).map((t: any) => {
      const department =
        subjectMapping[t.subject as keyof typeof subjectMapping] ?? '진료'
      const petName = t.pet?.name ?? t.petInfo?.name ?? '반려동물'
      const speciesKo =
        speciesMapping[t.pet?.species as keyof typeof speciesMapping] ??
        speciesMapping[t.petInfo?.species as keyof typeof speciesMapping] ??
        '반려동물'
      const agePart =
        t.pet?.age != null ? `${t.pet.age}세`
        : t.petInfo?.age != null ? `${t.petInfo.age}세` : ''
      const petInfo = [speciesKo, agePart, department].filter(Boolean).join(' | ')
      const slot = t.reservationTime ?? t.reservation_time
      const time = toTimeRange(t.startTime ?? t.start_time, t.endTime ?? t.end_time, slot) || '시간 미정'
      return {
        id: t.treatmentId,
        department,
        petName,
        petInfo,
        time,
        is_signed: !!(t.isCompleted ?? t.is_completed),
      }
    })

  // 📌 외부 데이터가 오면 그대로 사용
  useEffect(() => {
    if (!controlled) return
    setCards(mapToRows(data as any[]))
  }, [controlled, data])

  // 📌 외부 데이터가 없을 때만: 기존 내부 fetch 파이프라인 유지
  useEffect(() => {
    if (controlled) return
    let alive = true
    ;(async () => {
      try {
        setInternalLoading(true)
        const raw = (await getVetTreatments(2)) as any[]

        // 숫자 슬롯 가진 항목 상세로 보강
        const needFix = raw.filter(
          (it: any) => typeof it.startTime === 'number' || typeof it.endTime === 'number'
        )
        let merged: any[] = raw
        if (needFix.length > 0) {
          const ids = needFix.map((it) => it.treatmentId)
          const details = await Promise.all(ids.map((id) => getVetTreatmentDetail(id).catch(() => null)))
          const dmap = new Map<number, any>()
          ids.forEach((id, i) => { const d = details[i]; if (d) dmap.set(id, d) })
          merged = raw.map((it: any) => {
            const d = dmap.get(it.treatmentId)
            if (!d) return it
            return {
              ...it,
              startTime: d.startTime ?? d.start_time ?? it.startTime,
              endTime:   d.endTime   ?? d.end_time   ?? it.endTime,
              pet:       it.pet ?? it.petInfo ?? d.pet ?? d.petInfo,
              petInfo:   it.petInfo ?? d.petInfo ?? d.pet,
              subject:   it.subject ?? d.subject,
              isCompleted: (it.isCompleted ?? it.is_completed) ?? (d.isCompleted ?? d.is_completed),
              aiSummary: it.aiSummary ?? it.ai_summary ?? d?.aiSummary ?? d?.ai_summary ?? it.summaryText ?? d?.summaryText,
            }
          })
        }

        // 내부 모드에선 예전처럼 AI 요약 있는 항목만 노출 + 최신순 정렬
        const summarized = merged.filter(hasAiSummary)
        const rows = mapToRows(summarized).sort((a, b) => {
          const find = (id: number) => summarized.find((m: any) => m.treatmentId === id)
          const ts = (x: any) => {
            const s = x?.startTime ?? ''
            if (typeof s === 'string' && s) {
              const d = new Date(s.replace(' ', 'T').replace(/\.\d+$/, ''))
              if (!isNaN(d.getTime())) return d.getTime()
            }
            const slot = x?.reservationTime ?? x?.reservation_time
            return Number.isFinite(slot) ? Number(slot) * 30 * 60 * 1000 : 0
          }
          return ts(find(b.id)) - ts(find(a.id))
        })

        if (!alive) return
        setCards(rows)
      } catch {
        if (!alive) return
        setCards([])
      } finally {
        if (alive) setInternalLoading(false)
      }
    })()
    return () => { alive = false }
  }, [controlled])

  const isLoading = controlled ? !!loading : internalLoading
  const totalHeight = cards.length * SNAP_GAP + OVERLAP
  const paddedHeight = Math.max(totalHeight, MIN_CONTAINER_SCROLL_HEIGHT)

  return (
    <div
      ref={containerRef}
      className="overflow-y-scroll hide-scrollbar"
      style={{ height: '400px', scrollSnapType: 'y mandatory' }}
    >
      <div className="relative" style={{ height: `${paddedHeight}px` }}>
        {isLoading ? null : cards.map((card, i) => {
          const top = i * SNAP_GAP
          const isFocused = i === focusedIndex
          return (
            <div
              key={`${card.id}-${i}`}  // 🔒 고유 키
              className="absolute left-0 right-0 transition-transform duration-300 snap-start"
              style={{
                top,
                transform: isFocused ? 'scale(1)' : 'scale(0.96)',
                zIndex: isFocused ? 99 : cards.length - i,
              }}
              onClick={() => onCardClick?.(card.id)}
            >
              <TreatmentSlideCard
                time={card.time}
                department={card.department}
                petName={card.petName}
                petInfo={card.petInfo}
                isAuthorized={true}
                is_signed={card.is_signed}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default TreatmentSlideList
