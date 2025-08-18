// src/component/pages/Staff/Reservation/StaffReservationTimeSettingTab.tsx
import React, { useEffect, useMemo, useState } from 'react';
import FilterDropdown from '@/component/selection/FilterDropdown';
import ClosingTimeSelectionButton from '@/component/selection/ClosingTimeSelectionButton';
import Button from '@/component/button/Button';

import {
  getStaffHospitalDetail,
  getStaffVetsByHospital,
  getStaffVetsWithWorkingHours,
  postStaffVetClosingHours,
  getPublicVetClosingHours
} from '@/services/api/Staff/staffhospital';
import type { DayEng } from '@/types/Staff/staffhospitalType';
import { timeMapping } from '@/utils/timeMapping';

type Vet = {
  vetId: number;
  name: string;
  profile?: string;
  photo?: string;
};

type DayRange = { start?: string; end?: string }; // "HH:mm"
type WorkingByVet = Record<number, Record<DayEng, DayRange>>;

// 요일 상수/헬퍼
const DAYS_EN: DayEng[] = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
const DAYS_KO: Record<DayEng, string> = {
  MON: '월',
  TUE: '화',
  WED: '수',
  THU: '목',
  FRI: '금',
  SAT: '토',
  SUN: '일',
};
const dayEngFromDate = (d = new Date()): DayEng =>
  (['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][d.getDay()] as DayEng);

// 슬롯 <-> HH:mm
const slotIndexByHHmm: Record<string, number> = Object.fromEntries(
  Object.entries(timeMapping).map(([idx, hhmm]) => [hhmm, Number(idx)])
);

const toHHmm = (val: unknown): string => {
  if (typeof val === 'number') return timeMapping[val] ?? '';
  const s = String(val ?? '');
  if (!s) return '';
  if (/^\d+$/.test(s)) return timeMapping[Number(s)] ?? '';
  const m = s.match(/\b(\d{2}):(\d{2})\b/);
  return m ? `${m[1]}:${m[2]}` : '';
};

export default function StaffReservationTimeSettingTab() {
  const [loading, setLoading] = useState(true);
  const [vets, setVets] = useState<Vet[]>([]);
  const [selectedVetId, setSelectedVetId] = useState<string>('all');
  const [disabledTimes, setDisabledTimes] = useState<string[]>([]); // "HH:mm"
  const [workingByVet, setWorkingByVet] = useState<WorkingByVet>({});

  const today: DayEng = dayEngFromDate();

  // 데이터 로드
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);

        // 병원 정보
        const hospital = await getStaffHospitalDetail();
        if (!alive) return;

        // 수의사 목록
        const vetList = await getStaffVetsByHospital(hospital.hospitalId);
        if (!alive) return;

        const vlist: Vet[] = (vetList ?? []).map((v: any) => ({
          vetId: v.vetId,
          name: v.name,
          profile: v.profile,
          photo: v.photo,
        }));
        setVets(vlist);

        // 전체 근무시간(모든 수의사)
        const vw = await getStaffVetsWithWorkingHours();
        if (!alive) return;

        // vetId별, 요일별 "HH:mm" 범위 구성
        const byVet: WorkingByVet = {};
        (vw ?? []).forEach((row: any) => {
          const vid = row.vetId;
          const list = row.workingHourResponseList ?? row.workingHours ?? [];
          if (!vid) return;
          if (!byVet[vid])
            byVet[vid] = {
              MON: {},
              TUE: {},
              WED: {},
              THU: {},
              FRI: {},
              SAT: {},
              SUN: {},
            } as Record<DayEng, DayRange>;
          list.forEach((h: any) => {
            const d: DayEng = h.day;
            byVet[vid][d] = {
              start: toHHmm(h.startTime),
              end: toHHmm(h.endTime),
            };
          });
        });
        setWorkingByVet(byVet);
      } catch (e) {
        console.warn('[TimeSettingTab] fetch failed:', e);
        setVets([]);
        setWorkingByVet({});
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // 오늘자 근무시간 범위 계산 (개별 / 전체)
  const { rangeStart, rangeEnd } = useMemo(() => {
    if (selectedVetId === 'all') {
      // 모든 수의사의 오늘 근무시간을 합집합(최소 시작 ~ 최대 종료)
      let minStartIdx: number | null = null;
      let maxEndIdx: number | null = null;
      for (const v of vets) {
        const r = workingByVet[v.vetId]?.[today];
        if (!r?.start || !r?.end) continue;
        const sIdx = slotIndexByHHmm[r.start];
        const eIdx = slotIndexByHHmm[r.end];
        if (Number.isFinite(sIdx))
          minStartIdx = minStartIdx == null ? sIdx : Math.min(minStartIdx, sIdx);
        if (Number.isFinite(eIdx))
          maxEndIdx = maxEndIdx == null ? eIdx : Math.max(maxEndIdx, eIdx);
      }
      const start = minStartIdx != null ? timeMapping[minStartIdx] : '09:00';
      const end = maxEndIdx != null ? timeMapping[maxEndIdx] : '18:00';
      return { rangeStart: start, rangeEnd: end };
    } else {
      const vid = Number(selectedVetId);
      const r = workingByVet[vid]?.[today];
      return {
        rangeStart: r?.start || '09:00',
        rangeEnd: r?.end || '18:00',
      };
    }
  }, [selectedVetId, vets, workingByVet, today]);

  // ✅ 드롭다운: 이름 + 사진 + 오늘 근무시간 캡션(ReservationTab과 동일 컨셉)
  const dropdownOptions = useMemo(
    () => [
      {
        value: 'all',
        label: '전체 수의사',
        description: `${DAYS_KO[today]} ${rangeStart}-${rangeEnd}`,
      },
      ...vets.map((v) => {
        const r = workingByVet[v.vetId]?.[today];
        const start = r?.start;
        const end = r?.end;
        const desc = start && end ? `${DAYS_KO[today]} ${start}-${end}` : '근무시간 미정';
        return {
          value: String(v.vetId),
          label: v.name,
          description: desc,
          photo: v.photo || undefined,
        };
      }),
    ],
    [vets, workingByVet, today, rangeStart, rangeEnd]
  );

  useEffect(() => {
  let alive = true

  // '전체 수의사'는 서버 기준이 모호하니 프리필 없이 사용자 선택만 받게 둠
  if (selectedVetId === 'all') {
    return
  }

  (async () => {
    try {
      const vid = Number(selectedVetId)
      if (!Number.isFinite(vid)) return

      // 서버에서 닫힌 슬롯(0~47) 받아오기
      const slots = await getPublicVetClosingHours(vid)
      if (!alive) return

      // 근무 범위 안에 있는 시간만 “HH:mm”으로 변환해서 세팅
      const startIdx = slotIndexByHHmm[rangeStart]
      const endIdx   = slotIndexByHHmm[rangeEnd]

      const withinRange = slots.filter(idx => {
        if (!Number.isFinite(startIdx) || !Number.isFinite(endIdx)) return true
        return idx >= startIdx && idx <= endIdx
      })

      const hhmmList = withinRange
        .map(idx => timeMapping[idx])
        .filter(Boolean) as string[]

      setDisabledTimes(hhmmList)
    } catch (e) {
      console.warn('[TimeSettingTab] closing-hours preload failed:', e)
      // 실패 시 비워두고 사용자가 선택하도록
      setDisabledTimes([])
    }
  })()

  return () => { alive = false }
  // rangeStart/rangeEnd가 바뀌면 범위 밖 슬롯을 자동 걸러주려면 의존성에 포함
}, [selectedVetId, rangeStart, rangeEnd])
  // 등록
  const handleRegister = async () => {
    try {
      // "HH:mm" → 슬롯 인덱스
      const slots = disabledTimes
        .map((hhmm) => slotIndexByHHmm[hhmm])
        .filter((n) => Number.isFinite(n)) as number[];

      if (slots.length === 0) {
        alert('닫을 시간대를 하나 이상 선택해주세요.');
        return;
      }

      if (selectedVetId === 'all') {
        // 전체 수의사에게 같은 슬롯을 등록
        const ids = vets.map((v) => v.vetId);
        await Promise.all(ids.map((id) => postStaffVetClosingHours(id, slots)));
      } else {
        await postStaffVetClosingHours(Number(selectedVetId), slots);
      }

      alert('예약 불가 시간이 등록되었습니다.');
    } catch (e) {
      console.error(e);
      alert('등록 실패! 잠시 후 다시 시도해주세요.');
    }
  };

  return (
    <div className="space-y-6">
      <FilterDropdown
        options={dropdownOptions}
        value={selectedVetId}
        onChange={setSelectedVetId}
        placeholder="전체 수의사"
      />

      {/* 근무시간 범위만 슬롯으로 노출 */}
      <ClosingTimeSelectionButton
        vetId={selectedVetId}
        startTime={rangeStart}
        endTime={rangeEnd}
        disabledTimes={disabledTimes} // "HH:mm" 배열
        setDisabledTimes={setDisabledTimes}
      />

      <div className="pt-6">
        <Button onClick={handleRegister} text="등록하기" color="green" />
      </div>
    </div>
  );
}
