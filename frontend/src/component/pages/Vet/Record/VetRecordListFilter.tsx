// src/component/pages/Vet/Record/VetRecordListFilter.tsx
import React, { useEffect, useMemo, useState } from 'react';
import '@/styles/main.css';
import SelectionDropdown from '@/component/selection/SelectionDropdown';
import TreatmentSlideCard from '@/component/card/TreatmentSlideCard';
import type { VetTreatment, VetTreatmentDetail } from '@/types/Vet/vettreatmentType';
import { toTimeRange } from '@/utils/timeMapping';
import { getVetTreatments, getVetTreatmentDetail } from '@/services/api/Vet/vettreatment';

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

// ✅ 실제 시작시간이 있는지(문자열이고 날짜로 파싱 가능) 체크
const hasRealStartTime = (it: any): boolean => {
  const s = it?.startTime ?? it?.start_time;
  if (typeof s !== 'string' || !s.trim()) return false;
  const norm = s.replace(' ', 'T').replace(/\.\d+$/, '');
  const d = new Date(norm);
  return !isNaN(d.getTime());
};

interface Props {
  data?: VetTreatment[];           // 비어있으면 내부에서 type=2 호출
  onCardClick: (id: number) => void;
}

export default function VetRecordListFilter({ data = [], onCardClick }: Props) {
  const [selectedSigned, setSelectedSigned] =
    useState<'ALL' | 'true' | 'false'>('ALL');

  // 원본/보강본
  const [base, setBase] = useState<any[]>([]);
  const [enriched, setEnriched] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // ▶ 데이터 로드: props.data가 비어 있으면 type=2(전체 진료) 로드
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);

        const initialList =
          (data && data.length > 0) ? (data as any[]) : ((await getVetTreatments(2)) as any[]);

        if (!alive) return;
        setBase(initialList);

        // 모든 treatmentId 상세 병렬 로딩 (DateFilter와 동일)
        const ids = Array.from(new Set(initialList.map((x: any) => x.treatmentId))).filter(Boolean);
        if (ids.length === 0) {
          if (alive) setEnriched(initialList);
          return;
        }

        const results = await Promise.allSettled(ids.map((id) => getVetTreatmentDetail(id)));
        if (!alive) return;

        const dmap = new Map<number, VetTreatmentDetail>();
        results.forEach((r, i) => {
          if (r.status === 'fulfilled' && r.value) dmap.set(ids[i], r.value as VetTreatmentDetail);
        });

        // 상세로 보강 병합(시간/펫/과목/완료여부 우선)
        const merged = initialList.map((it: any) => {
          const d = dmap.get(it.treatmentId);
          if (!d) return it;
          return {
            ...it,
            startTime: d.startTime ?? d.start_time ?? it.startTime,
            endTime:   d.endTime   ?? d.end_time   ?? it.endTime,
            pet:       it.pet ?? it.petInfo ?? d.pet ?? d.petInfo,
            petInfo:   it.petInfo ?? d.petInfo ?? d.pet,
            subject:   it.subject ?? d.subject,
            isCompleted:
              (it.isCompleted ?? it.is_completed) ??
              (d.isCompleted  ?? d.is_completed),
          };
        });

        setEnriched(merged);
      } catch (e) {
        console.warn('[VetRecordListFilter] load/enrich failed:', e);
        if (alive) {
          setBase(data as any[]);
          setEnriched(data as any[]);
        }
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [data]);

  // 1) 서명상태 필터 → 2) ✅ 시작시간 없는 항목 제거 → 3) 최신 시작시간(desc)
  const filteredData = useMemo(() => {
    let list = [...enriched];

    if (selectedSigned !== 'ALL') {
      const want = selectedSigned === 'true';
      list = list.filter(
        (it: any) => !!(it.isCompleted ?? it.is_completed) === want
      );
    }

    // ✅ 시작시간 없는 항목 제외
    list = list.filter(hasRealStartTime);

    list.sort((a: any, b: any) => {
      const sa = a.startTime ?? a.start_time ?? '';
      const sb = b.startTime ?? b.start_time ?? '';
      return sa < sb ? 1 : -1;
    });

    return list as VetTreatment[];
  }, [enriched, selectedSigned]);

  // 날짜별 그룹핑 + 각 날짜 내부는 시간 내림차순(최근 먼저)
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
        const s = x.startTime ?? x.start_time ?? '';
        if (typeof s === 'string' && s) {
          const norm = s.replace(' ', 'T').replace(/\.\d+$/, '');
          const d = new Date(norm);
          if (!isNaN(d.getTime())) return d.getTime();
        }
        const slot = x.reservationTime ?? x.reservation_time;
        if (Number.isFinite(slot)) return Number(slot) * 30 * 60 * 1000;
        return 0;
      };
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
            placeholder={loading ? '불러오는 중…' : '서명상태 선택'}
          />
        </div>
      </div>

      <div className="px-7">
        {grouped.map(([dateKey, items]) => (
          <div key={dateKey} className="mb-5 mt-1">
            <div className="flex justify-between items-center mb-3">
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
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
