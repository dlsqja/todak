// src/component/pages/Vet/Record/VetRecordDateFilter.tsx
import React, { useEffect, useMemo, useState } from 'react';
import SelectionDropdown from '@/component/selection/SelectionDropdown';
import TreatmentSlideCard from '@/component/card/TreatmentSlideCard';
import type { VetTreatment } from '@/types/Vet/vettreatmentType';
import { toTimeRange } from '@/utils/timeMapping';

const subjectKo: Record<string, string> = {
  DENTAL: '치과',
  DERMATOLOGY: '피부과',
  ORTHOPEDICS: '정형외과',
  OPHTHALMOLOGY: '안과',
};
const koSpecies: Record<string, string> = { DOG: '강아지', CAT: '고양이', OTHER: '기타' };

const formatKoreanDate = (ymd: string) => {
  if (!ymd) return '날짜 미정';
  const [y, m, d] = ymd.split('-').map((v) => parseInt(v, 10));
  if (!y || !m || !d) return ymd;
  return `${y}년 ${m}월 ${d}일`;
};

// ── 날짜/시간 유틸 (ListFilter와 동일 규칙) ──────────────────
const pad2 = (n: number) => String(n).padStart(2, '0');
const hasTZ = (s: string) => /[zZ]|[+\-]\d{2}:?\d{2}$/.test(s);
const normalizeISOish = (s: string) => s.trim().replace(' ', 'T').replace(/(\.\d{3})\d+$/, '$1');
const parseServerDate = (s?: string | null): Date | null => {
  if (!s || typeof s !== 'string') return null;
  const isoish = normalizeISOish(s);
  const withTZ = hasTZ(isoish) ? isoish : `${isoish}Z`;
  const d = new Date(withTZ);
  return isNaN(d.getTime()) ? null : d;
};
const ymdLocalFromServer = (s?: string | null) => {
  const d = parseServerDate(s);
  if (!d) return '';
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
};

// 시작/종료가 “진짜 시각”인지 확인
const hasRealTime = (v: unknown): boolean => {
  if (v == null) return false;
  if (typeof v === 'string') {
    const norm = v.replace(' ', 'T').replace(/\.\d+$/, '');
    const d = new Date(norm);
    return !isNaN(d.getTime());
  }
  if (typeof v === 'number') {
    const d = new Date(v);
    return !isNaN(d.getTime());
  }
  if (v instanceof Date) return !isNaN(v.getTime());
  return false;
};
const hasRealStartTime = (it: any) => hasRealTime(it?.startTime ?? it?.start_time);
const hasRealEndTime   = (it: any) => hasRealTime(it?.endTime   ?? it?.end_time);

// 날짜 키: startTime ↔(없으면) reservationDay
const getDateKey = (t: any): string => {
  const ymd = ymdLocalFromServer(t?.startTime ?? t?.start_time);
  if (ymd) return ymd;
  const day = t?.reservationDay ?? t?.reservation_day ?? '';
  return typeof day === 'string' && day ? day.slice(0, 10) : '';
};

// 정렬용 타임스탬프(시작 → 종료 → 0)
const toMillisLoose = (v?: unknown): number => {
  if (v == null) return 0;
  const s = String(v).trim();
  if (!s) return 0;
  let iso = s.replace(' ', 'T').replace(/\.(\d{3})\d+$/, '.$1');
  if (/T/.test(iso) && !/(Z|[+\-]\d{2}:?\d{2})$/i.test(iso)) iso += 'Z';
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? 0 : d.getTime();
};
// ─────────────────────────────────────────────────────────

const makeInfo = (t: any) => {
  const p = t.pet ?? t.petInfo ?? {};
  const species = koSpecies[p.species as string] ?? '반려동물';
  const agePart = p.age != null ? `${p.age}세` : '';
  const subj = subjectKo[t.subject as string] ?? '진료';
  return [species, agePart, subj].filter(Boolean).join(' | ');
};

interface Props {
  data?: VetTreatment[];
  onCardClick: (id: number) => void;
}

export default function VetRecordDateFilter({ data = [], onCardClick }: Props) {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // ✅ 유령날짜 방지: 시작·종료 둘 다 “실제값”인 항목만 대상으로 날짜 수집
  const solidItems = useMemo(
    () => (data as any[]).filter((it) => hasRealStartTime(it) && hasRealEndTime(it)),
    [data]
  );

  const dates = useMemo(() => {
    const s = new Set<string>();
    for (const it of solidItems) {
      const key = getDateKey(it);
      if (key) s.add(key);
    }
    return Array.from(s).sort((a, b) => b.localeCompare(a));
  }, [solidItems]);

  const [selectedDate, setSelectedDate] = useState('');
  useEffect(() => {
    if (!selectedDate && dates.length) setSelectedDate(dates[0]);
    if (selectedDate && !dates.includes(selectedDate) && dates.length) {
      setSelectedDate(dates[0]);
    }
  }, [dates, selectedDate]);

  // 선택된 날짜의 카드 (같은 날짜 안에서는 시작시각 최신순)
  const selectedList = useMemo(() => {
    const list = solidItems.filter((it) => getDateKey(it) === selectedDate);
    list.sort(
      (a: any, b: any) =>
        (toMillisLoose(b?.startTime ?? b?.start_time) || toMillisLoose(b?.endTime ?? b?.end_time)) -
        (toMillisLoose(a?.startTime ?? a?.start_time) || toMillisLoose(a?.endTime ?? a?.end_time))
    );
    return list;
  }, [solidItems, selectedDate]);

  return (
    <div className="px-7">
      <SelectionDropdown
        options={dates.map((d) => ({ value: d, label: d }))}
        value={selectedDate}
        onChange={setSelectedDate}
        placeholder="날짜 선택"
        dropdownId="vet-record-date"
        activeDropdown={activeDropdown}
        setActiveDropdown={setActiveDropdown}
      />

      <div className="flex flex-col gap-3 mt-4">
        {!selectedDate ? (
          <h3 className="text-gray-600 text-center">날짜를 선택해주세요.</h3>
        ) : (
          <>
            <div className="flex justify-between items-center">
              <h4 className="h4 text-black">{formatKoreanDate(selectedDate)}</h4>
              <h4 className="h4 text-black">{selectedList.length}건</h4>
            </div>

            {selectedList.map((t: any) => {
              const timeRange = toTimeRange(
                t.startTime ?? t.start_time,
                t.endTime ?? t.end_time,
                t.reservationTime ?? t.reservation_time
              );

              const petName = t.pet?.name ?? t.petInfo?.name ?? '반려동물';
              const subject = subjectKo[(t.subject as string)] ?? '진료';
              const info = makeInfo(t);

              return (
                <TreatmentSlideCard
                  key={t.treatmentId}
                  time={timeRange}
                  department={subject}
                  petName={petName}
                  petInfo={info}
                  isAuthorized={true}
                  is_signed={!!(t.isCompleted ?? t.is_completed)}
                  onClick={() => onCardClick(t.treatmentId)}
                />
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}
