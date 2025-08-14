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
const koGender: Record<string, string> = {
  MALE: '남',
  FEMALE: '여',
  NON: '미상',
  MALE_NEUTERING: '남(중성화)',
  FEMALE_NEUTERING: '여(중성화)',
};

const formatDateKey = (val: unknown) => {
  if (val == null) return '';
  const s =
    typeof val === 'string'
      ? val
      : val instanceof Date
      ? val.toISOString()
      : String(val);

  const m = s.match(/^\d{4}-\d{2}-\d{2}/);
  if (m) return m[0];
  if (s.includes('T')) return s.split('T')[0] || '';
  if (s.includes(' ')) return s.split(' ')[0] || '';
  return '';
};
const formatKoreanDate = (ymd: string) => {
  if (!ymd) return '날짜 미정';
  const [y, m, d] = ymd.split('-').map((v) => parseInt(v, 10));
  if (!y || !m || !d) return ymd;
  return `${y}년 ${m}월 ${d}일`;
};
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
  // ✅ 상세 호출 제거: 로딩 플래그만 형태 유지
  const [loading] = useState(false);

  // 드롭다운 날짜 목록(리스트의 startTime만 사용)
  const dates = useMemo(() => {
    const s = new Set<string>();
    for (const it of data as any[]) {
      const key =
        formatDateKey((it as any).startTime) ||
        formatDateKey((it as any).start_time);
      if (key) s.add(key);
    }
    return Array.from(s).sort((a, b) => b.localeCompare(a)); // 최신 날짜 먼저
  }, [data]);

  const [selectedDate, setSelectedDate] = useState('');
  useEffect(() => {
    if (!selectedDate && dates.length) setSelectedDate(dates[0]);
    if (selectedDate && !dates.includes(selectedDate) && dates.length) {
      setSelectedDate(dates[0]);
    }
  }, [dates, selectedDate]);

  // 선택 날짜의 카드 목록(같은 날짜 안에서는 최신 시작시간이 위쪽)
  const selectedList = useMemo(() => {
    const list = (data as any[]).filter((it) => {
      const key =
        formatDateKey(it.startTime) ||
        formatDateKey(it.start_time);
      return key === selectedDate;
    });

    list.sort((a, b) => {
      const sa = String(a.startTime ?? a.start_time ?? '');
      const sb = String(b.startTime ?? b.start_time ?? '');
      return sb.localeCompare(sa); // 최신이 위
    });

    return list;
  }, [data, selectedDate]);

  return (
    <div className="px-7">
      <SelectionDropdown
        options={dates.map((d) => ({ value: d, label: d }))}
        value={selectedDate}
        onChange={setSelectedDate}
        placeholder={loading ? '불러오는 중…' : '날짜 선택'}
      />

      <div className="flex flex-col gap-3 mt-4">
        {!selectedDate ? (
          <h3 className="text-gray-600 text-center">{loading ? '불러오는 중…' : '날짜를 선택해주세요.'}</h3>
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
