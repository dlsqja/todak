// src/component/pages/Staff/Hospital/StaffHospitalVet.tsx
import React, { useEffect, useMemo, useState } from 'react';
import '@/styles/main.css';
import BackHeader from '@/component/header/BackHeader';
import Button from '@/component/button/Button';
import FilterDropdown from '@/component/selection/FilterDropdown';
import SelectionDropdown from '@/component/selection/SelectionDropdown';
import {
  getStaffHospitalDetail,
  getStaffVetsByHospital,
  saveStaffVetWorkingHours,
} from '@/services/api/Staff/staffhospital';
import type { StaffVetLite, StaffWorkingHourDto, DayEng } from '@/types/Staff/staffhospitalType';
import { timeMapping } from '@/utils/timeMapping';

const DAYS_EN: DayEng[] = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
const DAYS_KO: Record<DayEng, string> = { MON: '월', TUE: '화', WED: '수', THU: '목', FRI: '금', SAT: '토', SUN: '일' };

// "HH:mm" -> 슬롯 인덱스
const slotIndexByHHmm: Record<string, number> = Object.fromEntries(
  Object.entries(timeMapping).map(([idx, hhmm]) => [hhmm, Number(idx)]),
);

// 드롭다운 옵션: label=HH:mm, value="슬롯"
const TIME_OPTIONS = Object.entries(timeMapping).map(([idx, hhmm]) => ({ value: String(idx), label: hhmm }));

// ✅ workingId까지 들고다니는 상태!
type DayState = Record<DayEng, { workingId?: number | null; start: string; end: string }>;

export default function StaffHospitalVet() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [vets, setVets] = useState<StaffVetLite[]>([]);
  const [selectedVetId, setSelectedVetId] = useState<number | null>(null);

  const [activeSelectId, setActiveSelectId] = useState<string | null>(null);

  const [allStart, setAllStart] = useState(() => String(slotIndexByHHmm['09:00'])); // "18"
  const [allEnd, setAllEnd] = useState(() => String(slotIndexByHHmm['18:30'])); // "37"

  const [byDay, setByDay] = useState<DayState>(() => ({
    MON: { workingId: null, start: '', end: '' },
    TUE: { workingId: null, start: '', end: '' },
    WED: { workingId: null, start: '', end: '' },
    THU: { workingId: null, start: '', end: '' },
    FRI: { workingId: null, start: '', end: '' },
    SAT: { workingId: null, start: '', end: '' },
    SUN: { workingId: null, start: '', end: '' },
  }));

  // useEffect 내부 핵심 부분만 확인!
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        // ✅ 여기! /hospitals 로 병원 상세 가져오기
        const hospital = await getStaffHospitalDetail();

        if (!alive) return;
        // ✅ 병원 ID로 수의사 목록 + 근무시간 목록 한번에!
        const list = await getStaffVetsByHospital(hospital.hospitalId);

        if (!alive) return;
        setVets(list);
        if (list.length > 0) {
          setSelectedVetId(list[0].vetId);
          applyWorkingHoursToState(list[0].workingHours);
        }
      } catch (e: any) {
        if (!alive) return;
        setError(e?.message || '데이터를 불러오지 못했어요');
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // 서버 hours → byDay: workingId까지 보존, 시간은 슬롯 인덱스 문자열로
  function applyWorkingHoursToState(hours?: StaffWorkingHourDto[]) {
    const toSlotStr = (v: number | string | undefined): string => {
      if (v === undefined || v === null) return '';
      if (typeof v === 'number') return String(v); // 이미 0~47
      const sv = String(v);
      if (/^\d+$/.test(sv)) return sv; // ✅ "18" 같은 문자열 숫자도 그대로 슬롯으로 처리
      const idx = slotIndexByHHmm[sv]; // "HH:mm" → 슬롯
      return Number.isFinite(idx) ? String(idx) : '';
    };

    const next: DayState = {
      MON: { workingId: null, start: '', end: '' },
      TUE: { workingId: null, start: '', end: '' },
      WED: { workingId: null, start: '', end: '' },
      THU: { workingId: null, start: '', end: '' },
      FRI: { workingId: null, start: '', end: '' },
      SAT: { workingId: null, start: '', end: '' },
      SUN: { workingId: null, start: '', end: '' },
    };

    (hours || []).forEach((h) => {
      if (!h?.day) return;
      next[h.day] = {
        workingId: h.workingId ?? null,
        start: toSlotStr(h.startTime as any),
        end: toSlotStr(h.endTime as any),
      };
    });

    setByDay(next);
  }
  const handleVetChange = (vetIdStr: string) => {
    const vid = Number(vetIdStr);
    setSelectedVetId(vid);
    const found = vets.find((v) => v.vetId === vid);
    applyWorkingHoursToState(found?.workingHours);
  };

  const applyAll = () => {
    setByDay((prev) => {
      const next = { ...prev };
      for (const d of DAYS_EN) next[d] = { ...next[d], start: allStart, end: allEnd }; // ✅ workingId 유지!!
      return next;
    });
  };

  const toMinFromSlot = (slotStr: string) => {
    const n = Number(slotStr);
    return Number.isFinite(n) ? n * 30 : NaN;
  };

  const handleSave = async () => {
    if (!selectedVetId) return alert('수의사를 선택해주세요!');

    // 유효성: 시작 < 종료
    const bad = DAYS_EN.find((d) => {
      const { start, end } = byDay[d];
      if (!start || !end) return false;
      return toMinFromSlot(start) >= toMinFromSlot(end);
    });
    if (bad) return alert(`근무시간 오류: ${DAYS_KO[bad]}요일 시작이 끝보다 같거나 늦습니다!`);

    // ✅ workingId 포함해서 업서트 payload 구성
    const hours = DAYS_EN.filter((d) => byDay[d].start && byDay[d].end).map((d) => ({
      workingId: byDay[d].workingId ?? undefined, // 있으면 수정, 없으면 생성!!!
      day: d,
      startTime: Number(byDay[d].start), // 0~47
      endTime: Number(byDay[d].end), // 0~47
    }));

    try {
      setSaving(true);
      await saveStaffVetWorkingHours(selectedVetId, hours);
      alert('근무시간 등록/수정 완료!');
    } catch (e) {
      console.error(e);
      alert('저장 실패! 잠시 후 다시 시도해주세요.');
    } finally {
      setSaving(false);
    }
  };

  const vetOptions = useMemo(() => {
    return vets.map((v) => {
      const hasAny = (v.workingHours || []).some((h) => h.startTime !== undefined && h.endTime !== undefined);
      return {
        value: String(v.vetId),
        label: v.name,
        description: hasAny ? '근무시간 등록됨' : '근무시간 미정',
      };
    });
  }, [vets]);

  return (
    <>
      <BackHeader text="수의사 기본 근무 시간" />

      <div className="px-7 pb-24 pt-4 space-y-6">
        {/* 수의사 선택 */}
        <div className="bg-gray-100 p-4 rounded-2xl">
          <label className="block mb-2 h4 text-black">수의사 선택</label>
          <FilterDropdown
            options={vetOptions}
            placeholder="수의사를 선택하세요"
            value={selectedVetId ? String(selectedVetId) : ''}
            onChange={handleVetChange}
          />
          <p className="text-gray-500 mt-2 caption">
            {selectedVetId ? '근무시간을 편집할 수 있어요' : '수의사를 선택하면 기존 근무시간을 불러옵니다'}
          </p>
        </div>

        {/* 전체 설정 */}
        <div className="space-y-2">
          <label className="block h4 text-black">전체 설정</label>
          <div className="flex w-full items-center gap-3">
            <div className="flex-1 min-w-0">
              <div className="min-w-[112px]">
                <SelectionDropdown
                  id="all-start"
                  options={TIME_OPTIONS}
                  placeholder="시작"
                  value={allStart}
                  onChange={setAllStart}
                />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="min-w-[112px]">
                <SelectionDropdown
                  id="all-end"
                  options={TIME_OPTIONS}
                  placeholder="끝"
                  value={allEnd}
                  onChange={setAllEnd}
                />
              </div>
            </div>
            <div className="flex-none">
              <div className="min-w-[112px]">
                <Button color="lightgreen" text="전체 적용" onClick={applyAll} />
              </div>
            </div>
          </div>
        </div>

        {/* 요일별 설정 */}
        <div className="space-y-4">
          <label className="block h4 text-black">요일별 설정</label>
          {DAYS_EN.map((day) => (
            <div key={day} className="flex items-center gap-3">
              <span className="w-6 text-black h4">{DAYS_KO[day]}</span>
              <div className="flex-1">
                <SelectionDropdown
                  id={`${day}-start`}
                  options={TIME_OPTIONS}
                  placeholder="시작 시간"
                  value={byDay[day].start}
                  onChange={(v) => setByDay((prev) => ({ ...prev, [day]: { ...prev[day], start: v } }))}
                />
              </div>
              <div className="flex-1">
                <SelectionDropdown
                  id={`${day}-end`}
                  options={TIME_OPTIONS}
                  placeholder="종료 시간"
                  value={byDay[day].end}
                  onChange={(v) => setByDay((prev) => ({ ...prev, [day]: { ...prev[day], end: v } }))}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4">
          <Button color="green" text={saving ? '등록 중...' : '등록하기'} onClick={handleSave} />
        </div>
      </div>
    </>
  );
}
