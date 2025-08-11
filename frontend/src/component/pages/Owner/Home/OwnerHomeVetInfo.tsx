// src/component/pages/Owner/Home/VetInfoPage.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import BackHeader from '@/component/header/BackHeader';
import SingleContent from '@/component/text/SingleContent';
import TimeSelectionButton from '@/component/selection/TimeSelectionButton';
import Button from '@/component/button/Button';
import { useTimeStore } from '@/store/timeStore';

import { getVetsByHospitalId } from '@/services/api/Owner/ownerhome';
import type { VetPublic, WorkingHourResponse } from '@/types/Owner/ownerhomeType';
import { timeMapping } from '@/utils/timeMapping';

const dayMap = ['SUN','MON','TUE','WED','THU','FRI','SAT'] as const;

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

  const selectedTime = useTimeStore((s) => s.selectedTime);

  // 수의사 선택이 안 넘어왔으면: 병원 첫 번째 수의사(workingHours 포함) 불러오기
  useEffect(() => {
    if (vet) {
    console.log("🐾 수의사 데이터:", vet);
    console.log("🕒 근무 시간:", vet.workingHours);
  }
    if (vet?.vetId) return;
    if (!hospital?.hospitalId) return;

    (async () => {
      try {
        const list = await getVetsByHospitalId(hospital.hospitalId);
        setVet(list?.[0] ?? null);
      } catch (e) {
        console.warn('수의사 목록 조회 실패:', e);
        setVet(null);
      }
    })();
  }, [hospital?.hospitalId, vet?.vetId]);

  // 오늘 요일의 근무시간(첫 구간) 계산 + HH:mm로 변환
  const todayRange = useMemo(() => {
    const wh: WorkingHourResponse[] | undefined = vet?.workingHours;
    if (!wh || wh.length === 0) return null;

    const today = dayMap[new Date().getDay()]; // 'SUN'..'SAT'
    const slots = wh.filter(w => w.day === today);
    if (slots.length === 0) return null;

    const { startTime, endTime } = slots[0];
    return {
      startIdx: startTime,
      endIdx: endTime,
      startText: timeMapping[startTime] ?? '',
      endText: timeMapping[endTime] ?? '',
    };
  }, [vet?.workingHours]);

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
          />
        </div>
      </div>

      <div className="px-7 bg-gray-50">
        <Button color="green" text="진료 신청서 작성하러 가기" onClick={handleSubmit} />
      </div>
    </div>
  );
}
