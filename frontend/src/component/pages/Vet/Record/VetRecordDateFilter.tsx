// src/component/pages/Vet/Record/VetRecordDateFilter.tsx
import React, { useEffect, useMemo, useState } from 'react';
import SelectionDropdown from '@/component/selection/SelectionDropdown';
import TreatmentSlideCard from '@/component/card/TreatmentSlideCard';
import type { VetTreatment, VetTreatmentDetail } from '@/types/Vet/vettreatmentType';
import { toTimeRange } from '@/utils/timeMapping';
import { getVetTreatmentDetail } from '@/services/api/Vet/vettreatment';

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
  // 어떤 타입이 와도 일단 문자열로 만든 뒤 YYYY-MM-DD를 안전 추출
  const s =
    typeof val === 'string'
      ? val
      : val instanceof Date
      ? val.toISOString()
      : String(val);

  // 1) 맨 앞에 YYYY-MM-DD가 있으면 그걸 사용
  const m = s.match(/^\d{4}-\d{2}-\d{2}/);
  if (m) return m[0];

  // 2) "YYYY-MM-DDTHH:mm..." or "YYYY-MM-DD HH:mm..." 형태 지원
  if (s.includes('T')) return s.split('T')[0] || '';
  if (s.includes(' ')) return s.split(' ')[0] || '';

  // 그 외(숫자 슬롯 등)는 날짜로 쓸 수 없으니 공백
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
  // 상세 캐시: treatmentId -> detail
  const [details, setDetails] = useState<Record<number, VetTreatmentDetail>>({});
  const [loading, setLoading] = useState(false);

  // 목록이 바뀌면 id들에 대해 상세 한번씩만 병렬로 로딩
  useEffect(() => {
    let alive = true;
    (async () => {
      const ids = Array.from(new Set((data ?? []).map((x) => x.treatmentId))).filter(Boolean);
      if (!ids.length) {
        setDetails({});
        return;
      }
      setLoading(true);
      try {
        const results = await Promise.allSettled(ids.map((id) => getVetTreatmentDetail(id)));
        const map: Record<number, VetTreatmentDetail> = {};
        results.forEach((r, i) => {
          if (r.status === 'fulfilled' && r.value) {
            map[ids[i]] = r.value as VetTreatmentDetail;
          }
        });
        if (alive) setDetails(map);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [data]);

  // 드롭다운 날짜 목록(상세.startTime 우선, 없으면 목록의 startTime)
  const dates = useMemo(() => {
    const s = new Set<string>();
    for (const it of data as any[]) {
      const det = details[it.treatmentId];
      const key =
        formatDateKey(det?.startTime) ||
        formatDateKey((it as any).startTime) ||
        formatDateKey((it as any).start_time);
      if (key) s.add(key);
    }
    return Array.from(s).sort((a, b) => b.localeCompare(a)); // 최신 날짜 먼저
  }, [data, details]);

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
      const det = details[it.treatmentId];
      const key =
        formatDateKey(det?.startTime) ||
        formatDateKey(it.startTime) ||
        formatDateKey(it.start_time);
      return key === selectedDate;
    });

    list.sort((a, b) => {
      const da = details[a.treatmentId];
      const db = details[b.treatmentId];
      const sa = String(da?.startTime ?? a.startTime ?? a.start_time ?? '');
      const sb = String(db?.startTime ?? b.startTime ?? b.start_time ?? '');
      return sb.localeCompare(sa); // 최신이 위
    });

    return list;
  }, [data, details, selectedDate]);

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
            <div className="flex justify-between items-center mb-2">
              <h4 className="h4 text-black">{formatKoreanDate(selectedDate)}</h4>
              <h4 className="h4 text-black">{selectedList.length}건</h4>
            </div>

            {selectedList.map((t: any) => {
              const det = details[t.treatmentId];
              const timeRange = toTimeRange(
                det?.startTime ?? t.startTime ?? t.start_time,
                det?.endTime ?? t.endTime ?? t.end_time,
                // 목록 값이 슬롯 숫자라면 보조로 사용
                t.reservationTime ?? t.reservation_time
              );

              const petName = t.pet?.name ?? t.petInfo?.name ?? det?.pet?.name ?? '반려동물';
              const subject = subjectKo[(t.subject as string) ?? (det?.subject as string)] ?? '진료';
              const info = makeInfo(det ?? t);

              return (
                <TreatmentSlideCard
                  key={t.treatmentId}
                  time={timeRange}
                  department={subject}
                  petName={petName}
                  petInfo={info}
                  isAuthorized={true}
                  is_signed={!!(t.isCompleted ?? t.is_completed ?? det?.isCompleted)}
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
