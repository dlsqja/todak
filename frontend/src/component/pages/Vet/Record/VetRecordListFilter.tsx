// src/component/pages/Vet/Record/VetRecordListFilter.tsx
import React, { useEffect, useMemo, useState } from 'react';
import '@/styles/main.css';
import SelectionDropdown from '@/component/selection/SelectionDropdown';
import TreatmentSlideCard from '@/component/card/TreatmentSlideCard';
import type { VetTreatment } from '@/types/Vet/vettreatmentType';
import { toTimeRange } from '@/utils/timeMapping';
import { getVetTreatmentDetail } from '@/services/api/Vet/vettreatment';

const signedOptions = [
  { value: 'ALL', label: '전체 상태' },
  { value: 'false', label: '검토 대기' },
  { value: 'true', label: '서명 완료' },
] as const;

const subjectKo: Record<string, string> = {
  DENTAL: '치과',
  DERMATOLOGY: '피부과',
  ORTHOPEDICS: '정형외과',
  OPHTHALMOLOGY: '안과',
};

const koSpecies: Record<string, string> = {
  DOG: '강아지',
  CAT: '고양이',
  OTHER: '기타',
};

// YYYY-MM-DD → "YYYY년 M월 D일"
const formatKoreanDate = (ymd: string) => {
  if (!ymd) return '날짜 미정';
  const [y, m, d] = ymd.split('-').map((v) => parseInt(v, 10));
  if (!y || !m || !d) return ymd;
  return `${y}년 ${m}월 ${d}일`;
};

// startTime에서 날짜키 추출
const getDateKey = (t: any): string => {
  const s = t.startTime ?? t.start_time ?? '';
  if (typeof s !== 'string' || !s) return '';
  return s.includes('T') ? s.split('T')[0] : s.split(' ')[0] || '';
};

// "종류 | 나이세 | 과목"
const makeInfo = (t: any) => {
  const p = t.pet ?? t.petInfo ?? {};
  const species = koSpecies[p.species] ?? p.species ?? '반려동물';
  const agePart = p.age != null ? `${p.age}세` : '';
  const subject = subjectKo[t.subject] ?? '진료';
  return [species, agePart, subject].filter(Boolean).join(' | ');
};

interface Props {
  data?: VetTreatment[];
  onCardClick: (id: number) => void;
}

export default function VetRecordListFilter({ data = [], onCardClick }: Props) {
  const [selectedSigned, setSelectedSigned] =
    useState<'ALL' | 'true' | 'false'>('ALL');

  // 🔧 리스트 데이터 보정본 (상세 호출로 start/end를 실제 시간으로 덮어쓰기)
  const [enriched, setEnriched] = useState<any[]>(data as any[]);

  useEffect(() => {
    let alive = true;

    (async () => {
      // 처음엔 원본 그대로 반영
      setEnriched(data as any[]);

      // 숫자 슬롯처럼 보이는 항목들만 선별
      const needFix = (data as any[]).filter(
        (it) => typeof (it as any).startTime === 'number' || typeof (it as any).endTime === 'number'
      );

      if (needFix.length === 0) return;

      try {
        const ids = needFix.map((it: any) => it.treatmentId);
        const details = await Promise.all(
          ids.map((id) => getVetTreatmentDetail(id).catch(() => null))
        );
        const map = new Map<number, any>();
        ids.forEach((id, i) => {
          const d = details[i];
          if (d) map.set(id, d);
        });

        const merged = (data as any[]).map((it) => {
          const d = map.get(it.treatmentId);
          if (!d) return it;

          return {
            ...it,
            // 상세의 실제 시간을 우선 적용
            startTime: d.startTime ?? d.start_time ?? it.startTime,
            endTime: d.endTime ?? d.end_time ?? it.endTime,
            // 동물/과목/완료 여부도 최대한 보강
            pet: it.pet ?? it.petInfo ?? d.pet ?? d.petInfo,
            petInfo: it.petInfo ?? d.petInfo ?? d.pet,
            subject: it.subject ?? d.subject,
            isCompleted:
              (it.isCompleted ?? it.is_completed) ??
              (d.isCompleted ?? d.is_completed),
          };
        });

        if (alive) setEnriched(merged);
      } catch (e) {
        console.warn('[VetRecordListFilter] enrich failed:', e);
        if (alive) setEnriched(data as any[]);
      }
    })();

    return () => {
      alive = false;
    };
  }, [data]);

  // 1) 서명상태 필터 → 2) 최신 시작시간(desc) 정렬
  const filteredData = useMemo(() => {
    let list = [...enriched];

    if (selectedSigned !== 'ALL') {
      const want = selectedSigned === 'true';
      list = list.filter(
        (it: any) => !!(it.isCompleted ?? it.is_completed) === want
      );
    }

    list.sort((a: any, b: any) => {
      const sa = a.startTime ?? a.start_time ?? '';
      const sb = b.startTime ?? b.start_time ?? '';
      return sa < sb ? 1 : -1;
    });

    return list as VetTreatment[];
  }, [enriched, selectedSigned]);

  // 날짜별 그룹핑 + 각 날짜 내부는 시간 오름차순
  const grouped = useMemo(() => {
    const map = new Map<string, VetTreatment[]>();
    for (const it of filteredData as any[]) {
      const key = getDateKey(it) || '날짜 미정';
      const arr = map.get(key) ?? [];
      arr.push(it as any);
      map.set(key, arr);
    }

    const entries = Array.from(map.entries()).sort((a, b) => b[0].localeCompare(a[0]));
    for (const [, arr] of entries as any) {
  const getTs = (x: any) => {
    // 1) 문자열 시간 → 타임스탬프
    const s = x.startTime ?? x.start_time ?? '';
    if (typeof s === 'string' && s) {
      const norm = s.replace(' ', 'T').replace(/\.\d+$/, '');
      const d = new Date(norm);
      if (!isNaN(d.getTime())) return d.getTime();
    }
    // 2) 슬롯 숫자(0~47)면 30분 단위로 환산(하루 기준 상대값)
    const slot = x.reservationTime ?? x.reservation_time;
    if (Number.isFinite(slot)) return Number(slot) * 30 * 60 * 1000;
    return 0;
  };

  // ✅ 같은 날짜 내에서 최근(큰 시간) 먼저
  arr.sort((a: any, b: any) => getTs(b) - getTs(a));
}
    return entries as [string, VetTreatment[]][];
  }, [filteredData]);

  return (
    <>
      <div className="px-7 flex gap-3">
        <div className="flex-1">
          <SelectionDropdown
            options={signedOptions as any}
            value={selectedSigned}
            onChange={(v) => setSelectedSigned(v as any)}
            placeholder="서명상태 선택"
          />
        </div>
      </div>

      <div className="px-7">
        {grouped.map(([dateKey, items]) => (
          <div key={dateKey} className="mb-5">
            {/* 날짜 헤더: 좌측=진료 일자, 우측=해당 날짜 건수 */}
            <div className="flex justify-between items-center mb-2">
              <h4 className="h4 text-black">{formatKoreanDate(dateKey)}</h4>
              <h4 className="h4 text-black">{items.length}건</h4>
            </div>

            <div className="flex flex-col gap-3">
              {items.map((t: any) => {
                const start = t.startTime ?? t.start_time;
                const end   = t.endTime   ?? t.end_time;
                const slot  = t.reservationTime ?? t.reservation_time;
                const timeRange = toTimeRange(start, end, slot);

                const petName = t.pet?.name ?? t.petInfo?.name ?? '반려동물';
                const subject = subjectKo[t.subject] ?? '진료';
                const info    = makeInfo(t);

                return (
                  <TreatmentSlideCard
                    key={t.treatmentId}
                    time={timeRange}               // "10:00 - 10:30"
                    department={subject}           // 과목
                    petName={petName}              // 반려동물 이름
                    petInfo={info}                 // "종류 | 나이세 | 과목"
                    isAuthorized={true}
                    is_signed={!!(t.isCompleted ?? t.is_completed)}
                    onClick={() => onCardClick(t.treatmentId)}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
