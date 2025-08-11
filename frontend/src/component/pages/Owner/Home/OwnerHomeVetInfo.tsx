// src/component/pages/Owner/Home/VetInfoPage.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import BackHeader from '@/component/header/BackHeader';
import SingleContent from '@/component/text/SingleContent';
import TimeSelectionButton from '@/component/selection/TimeSelectionButton';
import Button from '@/component/button/Button';
import { useTimeStore } from '@/store/timeStore';

import { getVetsByHospitalId, getVetClosingHours } from '@/services/api/Owner/ownerhome';
import type { VetPublic, WorkingHourResponse } from '@/types/Owner/ownerhomeType';
import { timeMapping } from '@/utils/timeMapping';

const dayMap = ['SUN','MON','TUE','WED','THU','FRI','SAT'] as const;

// 🔹 보조 함수(페이지 내부용): 구간 인덱스 만들기
const buildIndices = (startIdx: number, endIdx: number) =>
  Array.from({ length: Math.max(0, endIdx - startIdx) }, (_, i) => startIdx + i);

export default function VetInfoPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const pet = location.state?.pet;
  const hospital = location.state?.hospital as {
    hospitalId: number;
    name: string;
    location?: string;
    profile?: string;
  };
  const passedVet = location.state?.vet as (VetPublic | undefined);

  const [vet, setVet] = useState<VetPublic | null>(passedVet ?? null);
  const [closingHours, setClosingHours] = useState<number[]>([]);

  const selectedTime = useTimeStore((s) => s.selectedTime);

  // 수의사 없으면 병원의 첫 번째 수의사
  useEffect(() => {
    if (vet?.vetId) return;
    if (!hospital?.hospitalId) return;

    (async () => {
      try {
        const list = await getVetsByHospitalId(hospital.hospitalId);
        setVet(list?.[0] ?? null);
      } catch {
        setVet(null);
      }
    })();
  }, [hospital?.hospitalId, vet?.vetId]);

  // 🔹 closing-hours 가져오기 (0~47)
  useEffect(() => {
    if (!vet?.vetId) return;
    (async () => {
      try {
        const blocked = await getVetClosingHours(vet.vetId);
        setClosingHours(Array.isArray(blocked) ? blocked : []);
      } catch {
        setClosingHours([]);
      }
    })();
  }, [vet?.vetId]);

  // 오늘 근무시간 + closing 제외한 사용 가능 슬롯
  const todayRange = useMemo(() => {
    const wh: WorkingHourResponse[] | undefined = vet?.workingHours;
    if (!wh || wh.length === 0) return null;

    const today = dayMap[new Date().getDay()];
    const slot = wh.find(w => w.day === today);
    if (!slot) return null;

    const allIdx = buildIndices(slot.startTime, slot.endTime);
    const usableIdx = allIdx.filter(i => !closingHours.includes(i));
    const usableTimes = usableIdx.map(i => timeMapping[i]).filter(Boolean);

    return {
      startText: timeMapping[slot.startTime] ?? '',
      endText: timeMapping[slot.endTime] ?? '',
      usableTimes, // ← 실제 노출할 "HH:mm" 목록
    };
  }, [vet?.workingHours, closingHours]);

  const handleSubmit = () => {
    if (!selectedTime) {
      alert('시간을 선택해주세요!');
      return;
    }
    navigate('/owner/home/form', { state: { pet, hospital, vet, time: selectedTime } });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <BackHeader text="수의사 정보" />

      <div className="flex-1 overflow-y-auto px-7 py-6 flex flex-col gap-3">
        {/* 프로필 */}
        <div className="w-full h-[200px] bg-gray-100 rounded-[12px] flex items-center justify-center text-gray-400 overflow-hidden">
          {vet?.photo ? (
            <img src={vet.photo} alt={vet.name} className="w-full h-full object-cover" />
          ) : (
            '수의사 프로필 사진'
          )}
        </div>

        {/* 헤더 정보 */}
        <div>
          <h3 className="h3 mt-1">{vet?.name || '수의사 이름'}</h3>
          <h4 className="h4 text-gray-400">
            {hospital?.name}
            {todayRange?.startText && todayRange?.endText
              ? <> · 진료 가능 시간 {todayRange.startText}~{todayRange.endText}</>
              : null}
          </h4>
        </div>

        <SingleContent title="의사 소개" content={vet?.profile || '의사 소개 정보가 없습니다.'} />
        <SingleContent title="병원 정보" content={hospital?.profile || '병원 소개글이 없습니다.'} />
        <SingleContent title="병원 위치" content={hospital?.location || '병원 주소가 없습니다.'} />

        <div>
          <h4 className="h4 mb-2">진료 가능 시간</h4>
          <TimeSelectionButton
            start_time={todayRange?.startText || '09:00'}
            end_time={todayRange?.endText || '18:00'}
            available_times={todayRange?.usableTimes ?? []}
          />

        </div>
      </div>

      <div className="px-7 bg-gray-50">
        <Button color="green" text="진료 신청서 작성하러 가기" onClick={handleSubmit} />
      </div>
    </div>
  );
}
