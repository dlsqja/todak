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

const dayMap = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'] as const;

// 🔹 "HH:mm" -> 슬롯 인덱스 매핑
const slotIndexByHHmm: Record<string, number> = Object.fromEntries(
  Object.entries(timeMapping).map(([idx, hhmm]) => [hhmm, Number(idx)]),
);

// 🔹 보조: 구간 인덱스 [start, end) 만들기 (end는 미포함)
const buildIndices = (startIdx: number, endIdx: number) =>
  Array.from({ length: Math.max(0, endIdx - startIdx) }, (_, i) => startIdx + i);

// 🔹 숫자/문자 혼용되는 시작/종료 값을 안전하게 슬롯 인덱스로 변환
const toSlotIdx = (v: number | string | undefined | null): number => {
  if (v == null) return NaN;
  if (typeof v === 'number') return v;
  const s = String(v);
  if (/^\d+$/.test(s)) return Number(s); // "18" 같은 문자열 숫자
  const idx = slotIndexByHHmm[s]; // "09:00" 같은 HH:mm
  return Number.isFinite(idx) ? idx : NaN;
};

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
  const passedVet = location.state?.vet as VetPublic | undefined;

  const [vet, setVet] = useState<VetPublic | null>(passedVet ?? null);
  const [closingHours, setClosingHours] = useState<number[]>([]); // 0~47
  const selectedTime = useTimeStore((s) => s.selectedTime);

  // ✅ 수의사 없으면 병원의 첫 번째 수의사로
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

  // ✅ 선택된 수의사의 closing-hours(0~47) 로드
  useEffect(() => {
    if (!vet?.vetId) return;
    (async () => {
      try {
        const blocked = await getVetClosingHours(vet.vetId);
        const rows = Array.isArray(blocked) ? blocked : [];
        setClosingHours(rows.map(Number).filter((n) => Number.isFinite(n)));
      } catch {
        setClosingHours([]);
      }
    })();
  }, [vet?.vetId]);

  // ✅ 오늘 근무시간 + closing 제외한 사용 가능 슬롯 계산(숫자/문자 모두 대응)
  const todayRange = useMemo(() => {
    const wh: WorkingHourResponse[] | undefined = vet?.workingHours;
    if (!wh || wh.length === 0) return null;

    const today = dayMap[new Date().getDay()];
    const slot = wh.find((w) => w.day === today);
    if (!slot) return null;

    // 시작/종료를 슬롯 인덱스로 표준화
    const startIdx = toSlotIdx(slot.startTime as any);
    const endIdx = toSlotIdx(slot.endTime as any);
    if (!Number.isFinite(startIdx) || !Number.isFinite(endIdx) || endIdx <= startIdx) {
      return null; // 범위가 이상하면 표시 안 함
    }

    // 근무시간 전체 슬롯 [start, end) 중 closing 제외
    const allIdx = buildIndices(startIdx, endIdx);
    const blocked = new Set(closingHours);
    const usableIdx = allIdx.filter((i) => !blocked.has(i));

    const startText = timeMapping[startIdx] ?? '';
    const endText = timeMapping[endIdx] ?? '';
    const usableTimes = usableIdx.map((i) => timeMapping[i]).filter(Boolean);

    return { startText, endText, usableTimes };
  }, [vet?.workingHours, closingHours]);

  const handleSubmit = () => {
    if (!selectedTime) return alert('시간을 선택해주세요!');
    navigate('/owner/home/form', {
      state: {
        pet,
        hospital,
        vet,
        time: selectedTime,
        startTime: todayRange?.startText,
        endTime: todayRange?.endText,
        usableTimes: todayRange?.usableTimes, // 필요하면 사용
      },
    });
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
            {todayRange?.startText && todayRange?.endText ? (
              <>
                {' '}
                · 진료 가능 시간 {todayRange.startText}~{todayRange.endText}
              </>
            ) : null}
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
            // ✅ 근무시간 내부에서 closing 제외한 목록만 전달 → 비활성화가 자동 반영
            available_times={todayRange?.usableTimes ?? []}
          />
          <div className="px-7 bg-gray-50">
            <Button color="green" text="진료 신청서 작성하러 가기" onClick={handleSubmit} />
          </div>
        </div>
      </div>
    </div>
  );
}
