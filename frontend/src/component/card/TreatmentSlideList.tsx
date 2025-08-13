// src/component/card/TreatmentSlideList.tsx

import React, { useRef, useEffect, useState } from 'react'
import TreatmentSlideCard from '@/component/card/TreatmentSlideCard'
import { getVetTreatments, getVetTreatmentDetail } from '@/services/api/Vet/vettreatment'
import type { VetTreatment } from '@/types/Vet/vettreatmentType'
import { toTimeRange } from '@/utils/timeMapping'
import { subjectMapping } from '@/utils/subjectMapping'
import { speciesMapping } from '@/utils/speciesMapping'

const CARD_HEIGHT = 96
const OVERLAP = 40
const SNAP_GAP = CARD_HEIGHT - OVERLAP
const MIN_CONTAINER_SCROLL_HEIGHT = 600 // 최소 스크롤 영역

type CardRow = {
  id: number
  department: string
  petName: string
  petInfo: string   
  time: string      // "HH:mm - HH:mm"
  is_signed: boolean
}

interface Props {
  onCardClick?: (id: number) => void
}

const TreatmentSlideList = ({ onCardClick }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [focusedIndex, setFocusedIndex] = useState(0)
  const [cards, setCards] = useState<CardRow[]>([])

  // 스크롤 포커스(애니메이션 로직) — 원본 그대로!!!!
  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const handleScroll = () => {
      const index = Math.round(container.scrollTop / SNAP_GAP)
      setFocusedIndex(index)
    }
    container.addEventListener('scroll', handleScroll)
    return () => container.removeEventListener('scroll', handleScroll)
  }, [])

  // 데이터 로딩: ListFilter와 동일한 보정 로직(숫자 슬롯 → 상세로 덮어쓰기)
  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        // 1) 기본 목록(type=2)
        const raw = (await getVetTreatments(2)) as VetTreatment[]

        // 2) 숫자 슬롯을 가진 항목 선별해서 상세로 start/end 보정
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
            }
          })
        }

        // 3) ListFilter와 동일한 카드 매핑 규칙
        const rows: CardRow[] = merged
          .map((t: any) => {
            const subjectKo =
              subjectMapping[t.subject as keyof typeof subjectMapping] ?? '진료'
            const petName = t.pet?.name ?? t.petInfo?.name ?? '반려동물'
            const speciesKo =
              speciesMapping[t.pet?.species as keyof typeof speciesMapping] ??
              speciesMapping[t.petInfo?.species as keyof typeof speciesMapping] ??
              '반려동물'
            const agePart =
              t.pet?.age != null
                ? `${t.pet.age}세`
                : t.petInfo?.age != null
                ? `${t.petInfo.age}세`
                : ''
            const info = [speciesKo, agePart, subjectKo].filter(Boolean).join(' | ') // ✅ 동일!

            const slot = t.reservationTime ?? t.reservation_time
            const time = toTimeRange(t.startTime ?? t.start_time, t.endTime ?? t.end_time, slot) || '시간 미정'

            return {
              id: t.treatmentId,
              department: subjectKo,
              petName,
              petInfo: info,
              time,
              is_signed: !!(t.isCompleted ?? t.is_completed),
            }
          })
          // 4) 최근 시작시간 기준으로 내림차순(동일 날짜/시간 처리도 ListFilter 방식과 호환)
          .sort((a, b) => {
            const toTs = (x: any) => {
              const s = merged.find((m: any) => m.treatmentId === x.id)?.startTime ?? ''
              if (typeof s === 'string' && s) {
                const norm = s.replace(' ', 'T').replace(/\.\d+$/, '')
                const d = new Date(norm)
                if (!isNaN(d.getTime())) return d.getTime()
              }
              const slot = merged.find((m: any) => m.treatmentId === x.id)?.reservationTime
                ?? merged.find((m: any) => m.treatmentId === x.id)?.reservation_time
              return Number.isFinite(slot) ? Number(slot) * 30 * 60 * 1000 : 0
            }
            return toTs(b) - toTs(a)
          })

        if (!alive) return
        setCards(rows)
      } catch {
        if (!alive) return
        setCards([])
      }
    })()
    return () => {
      alive = false
    }
  }, [])

  const totalHeight = cards.length * SNAP_GAP + OVERLAP
  const paddedHeight = Math.max(totalHeight, MIN_CONTAINER_SCROLL_HEIGHT)

  return (
    <div
      ref={containerRef}
      className="overflow-y-scroll hide-scrollbar"
      style={{
        height: '400px',              
        scrollSnapType: 'y mandatory',
      }}
    >
      <div className="relative" style={{ height: `${paddedHeight}px` }}>
        {cards.map((card, i) => {
          const top = i * SNAP_GAP
          const isFocused = i === focusedIndex

          return (
            <div
              key={card.id}
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
