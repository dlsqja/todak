// src/component/pages/Vet/VetHome.tsx
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '@/styles/main.css'
import OwnerTreatmentSimpleCard from '@/component/card/OwnerTreatmentSimpleCard'
import TreatmentSlideList from '@/component/card/TreatmentSlideList'

// ✅ 시간 범위 유틸(목록 페이지와 동일 로직)
import { toTimeRange } from '@/utils/timeMapping'

// ✅ 매핑 유틸(목록 페이지와 동일)
import { speciesMapping } from '@/utils/speciesMapping'
import { genderMapping } from '@/utils/genderMapping'
import { subjectMapping } from '@/utils/subjectMapping'

// ✅ API
import { getVetMy } from '@/services/api/Vet/vetmypage'
import { getVetTreatmentList } from '@/services/api/Vet/vettreatment'
import type { VetMyResponse, VetTreatmentListResponse } from '@/types/Vet'

export default function VetHome() {
  const navigate = useNavigate()

  const [me, setMe] = useState<VetMyResponse | null>(null)
  const [loadingMe, setLoadingMe] = useState(true)

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const res = await getVetMy()
        if (!alive) return
        setMe(res)
      } catch (e) {
        console.warn('[VetHome] getVetMy failed', e)
      } finally {
        if (alive) setLoadingMe(false)
      }
    })()
    return () => { alive = false }
  }, [])

  type CardRow = {
    id: number            // reservationId
    time: string          // "HH:mm - HH:mm"
    department: string    // 한글 과목
    petName: string
    petInfo: string       // "종 / 성별 / 나이세"
  }

  const [reservationCards, setReservationCards] = useState<CardRow[]>([])
  const [loadingList, setLoadingList] = useState(true)

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        setLoadingList(true)
        const list = await getVetTreatmentList() // type=0 목록
        if (!alive) return

        const rows = (list as VetTreatmentListResponse[]).map((it) => {
          const pet = it.petInfo
          const species = speciesMapping[pet.species as keyof typeof speciesMapping] ?? '반려동물'
          const gender  = genderMapping[pet.gender as keyof typeof genderMapping] ?? '성별미상'
          const agePart = Number.isFinite(pet.age) ? `${pet.age}세` : ''
          const department = subjectMapping[it.subject as keyof typeof subjectMapping] ?? '진료'
          const time = toTimeRange(it.startTime, it.endTime) || ''

          return {
            id: it.reservationId,
            time,
            department,
            petName: pet.name,
            petInfo: [species, gender, agePart].filter(Boolean).join(' / '),
          } as CardRow
        })

        setReservationCards(rows)
      } catch (e) {
        console.warn('[VetHome] getVetTreatmentList failed:', e)
        setReservationCards([])
      } finally {
        if (alive) setLoadingList(false)
      }
    })()
    return () => { alive = false }
  }, [])

  return (
    <div>
      <h3 className="h3 mx-7 pt-13">
        {loadingMe ? '수의사님 반갑습니다!' : `${me?.name ?? ''} 수의사님 반갑습니다!`}
      </h3>

      <h3 className="h3 mx-7 mb-2">어플 사용이 처음이신가요?</h3>
      <button
        onClick={() => navigate('/vet/home/guide')}
        className="h5 mx-7 px-5 py-1 rounded-full inline-block 
        bg-green-300 text-green-100 hover:bg-green-200 transition"
      >
        비대면 진료 가이드
      </button>

      <h3 className="mx-7 h3 mt-11">비대면 진료 예정 목록</h3>
      <div className="overflow-x-auto overflow-visible snap-x snap-mandatory scroll-smooth hide-scrollbar mx-7 pt-3 pb-6">
        <div className="w-max flex gap-4 h-full p-3">
          {loadingList ? (
            <>
              <div className="w-[260px] h-24 rounded-2xl bg-gray-100 animate-pulse" />
              <div className="w-[260px] h-24 rounded-2xl bg-gray-100 animate-pulse" />
            </>
          ) : (
            reservationCards.map((r) => (
              <div
                key={r.id}
                className="cursor-pointer"
                onClick={() => navigate(`/vet/treatment/detail/${r.id}`)} // ✅ 목록 페이지와 동일하게 상세로!
              >
                <OwnerTreatmentSimpleCard
                  time={r.time}
                  department={r.department}
                  petName={r.petName}
                  petInfo={r.petInfo}
                />
              </div>
            ))
          )}
        </div>
      </div>

      <h3 className="mx-7 h3">진료 기록 검토</h3>
      <div className="mx-7">
        <TreatmentSlideList onCardClick={(id) => navigate(`/vet/records/detail/${id}`)} />
      </div>
    </div>
  )
}
