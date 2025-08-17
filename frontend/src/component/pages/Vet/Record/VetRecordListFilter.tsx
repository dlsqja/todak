// src/component/pages/Vet/Record/VetRecordListFilter.tsx
import React, { useEffect, useMemo, useState } from 'react';
import '@/styles/main.css';
import SelectionDropdown from '@/component/selection/SelectionDropdown';
import TreatmentSlideCard from '@/component/card/TreatmentSlideCard';
import type { VetTreatment } from '@/types/Vet/vettreatmentType';
import { toTimeRange } from '@/utils/timeMapping';
import { getVetTreatments } from '@/services/api/Vet/vettreatment';
import { speciesMapping } from '@/utils/speciesMapping';
import { subjectMapping } from '@/utils/subjectMapping';

const signedOptions = [
  { value: 'ALL', label: '전체 상태' },
  { value: 'false', label: '검토 대기' },
  { value: 'true', label: '서명 완료' },
] as const;

// YYYY-MM-DD → "YYYY년 M월 D일"
const formatKoreanDate = (ymd: string) => {
  if (!ymd) return '날짜 미정';
  const [y, m, d] = ymd.split('-').map((v) => parseInt(v, 10));
  if (!y || !m || !d) return ymd;
  return `${y}년 ${m}월 ${d}일`;
};

const pad2 = (n: number) => String(n).padStart(2, '0');
const hasTZ = (s: string) => /[zZ]|[+\-]\d{2}:?\d{2}$/.test(s);
const normalizeISOish = (s: string) => {
  let out = s.trim().replace(' ', 'T');
  // 소수점 3자리까지만(일부 DB가 6자리까지 줌)
  out = out.replace(/(\.\d{3})\d+$/, '$1');
  return out;
};
const parseServerDate = (s?: string | null): Date | null => {
  if (!s || typeof s !== 'string') return null;
  const isoish = normalizeISOish(s);
  // TZ가 없으면 UTC로 간주(Z 부여) → 일관된 파싱
  const withTZ = hasTZ(isoish) ? isoish : `${isoish}Z`;
  const d = new Date(withTZ);
  return isNaN(d.getTime()) ? null : d;
};
const ymdLocalFromServer = (s?: string | null) => {
  const d = parseServerDate(s);
  if (!d) return '';
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
};

// startTime에서 날짜키 추출
const getDateKey = (t: any): string => {
  const ymd = ymdLocalFromServer(t.startTime ?? t.start_time);
  if (ymd) return ymd;

  // startTime이 없으면 예약일 문자열(이미 YYYY-MM-DD일 가능성 높음) 사용
  const day = t.reservationDay ?? t.reservation_day ?? '';
  if (typeof day === 'string' && day) return day.slice(0, 10);

  return '날짜 미정';
};

// "종류 | 나이세 | 과목" (utils 매핑 사용)
const makeInfo = (t: any) => {
  const p = t.pet ?? t.petInfo ?? {};
  const speciesKo = speciesMapping[p.species as keyof typeof speciesMapping] ?? p.species ?? '반려동물';
  const agePart = p.age != null ? `${p.age}세` : '';
  const subjectKo = subjectMapping[t.subject as keyof typeof subjectMapping] ?? '진료';
  return [speciesKo, agePart, subjectKo].filter(Boolean).join(' | ');
};

// ✅ 실제 시작시간 있는지(리스트의 startTime 문자열 기준) 체크
const hasRealStartTime = (it: any): boolean => {
  const s = it?.startTime ?? it?.start_time;
  if (typeof s !== 'string' || !s.trim()) return false;
  const norm = s.replace(' ', 'T').replace(/\.\d+$/, '');
  const d = new Date(norm);
  return !isNaN(d.getTime());
};

// ✅ 실제 종료시간 있는지(리스트의 endTime 문자열 기준) 체크
const hasRealEndTime = (it: any): boolean => {
  const s = it?.endTime ?? it?.end_time;
  if (typeof s !== 'string' || !s.trim()) return false;
  const norm = s.replace(' ', 'T').replace(/\.\d+$/, ''); // 소수초 제거
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
const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  // ▶ 데이터 로드: props.data가 비어 있으면 type=2(전체 진료) 로드
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);

        // ✅ 상세 호출 없이, 리스트(type=2)의 필드 그대로 사용
        const initialList =
          (data && data.length > 0) ? (data as any[]) : ((await getVetTreatments(2)) as any[]);

        if (!alive) return;
        setBase(initialList);
        setEnriched(initialList); // ← 바로 사용 (startTime/endTime 포함)
      } catch (e) {
        console.warn('[VetRecordListFilter] load failed:', e);
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

    // 시작 / 종료 시간 없는 항목 제외 (리스트의 startTime 기준)
    list = list.filter(hasRealStartTime);
    list = list.filter(hasRealEndTime); 

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
  dropdownId="signed"                       // 🔹 고유 id
  activeDropdown={activeDropdown}           // 🔹 전역 활성 id
  setActiveDropdown={setActiveDropdown}     // 🔹 setter
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
                const subjectKo = subjectMapping[t.subject as keyof typeof subjectMapping] ?? '진료';
                const info    = makeInfo(t);

                return (
                  <TreatmentSlideCard
                    key={t.treatmentId}
                    time={timeRange}
                    department={subjectKo}
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
