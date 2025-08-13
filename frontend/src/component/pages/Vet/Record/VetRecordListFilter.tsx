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

// ✅ AI 요약 존재 여부 판단(여러 키 대응)
const hasAiSummary = (t: any): boolean => {
  const cand =
    t.aiSummary ??
    t.ai_summary ??
    t.summary?.ai ??
    t.summary?.aiSummary ??
    t.summaryText ??
    t.summary_text ??
    t.aiNote ??
    t.ai_note;

  if (cand == null) return false;
  if (typeof cand === 'string') return cand.trim().length > 0;
  if (Array.isArray(cand)) return cand.some((x) => String(x ?? '').trim().length > 0);
  if (typeof cand === 'object') return Object.values(cand).some((v) => String(v ?? '').trim().length > 0);
  return false;
};

interface Props {
  data?: VetTreatment[];
  onCardClick: (id: number) => void;
}

export default function VetRecordListFilter({ data = [], onCardClick }: Props) {
  // ✅ 서명 상태만 남기고, AI 요약은 항상 “있음”으로 고정 필터
  const [selectedSigned, setSelectedSigned] =
    useState<'ALL' | 'true' | 'false'>('ALL');

  // 상세 호출로 시간/필드 보강
  const [enriched, setEnriched] = useState<any[]>(data as any[]);

  useEffect(() => {
    let alive = true;

    (async () => {
      setEnriched(data as any[]);

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
            startTime: d.startTime ?? d.start_time ?? it.startTime,
            endTime: d.endTime ?? d.end_time ?? it.endTime,
            pet: it.pet ?? it.petInfo ?? d.pet ?? d.petInfo,
            petInfo: it.petInfo ?? d.petInfo ?? d.pet,
            subject: it.subject ?? d.subject,
            isCompleted:
              (it.isCompleted ?? it.is_completed) ??
              (d.isCompleted ?? d.is_completed),
            // 요약도 상세에서 보강
            aiSummary:
              it.aiSummary ??
              it.ai_summary ??
              d.aiSummary ??
              d.ai_summary ??
              it.summaryText ??
              d.summaryText,
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

  // 1) 서명상태 필터 → 2) ✅ AI 요약 있는 것만 남김 → 3) 최신 시작시간(desc)
  const filteredData = useMemo(() => {
    let list = [...enriched];

    if (selectedSigned !== 'ALL') {
      const want = selectedSigned === 'true';
      list = list.filter(
        (it: any) => !!(it.isCompleted ?? it.is_completed) === want
      );
    }

    // ✅ 고정 필터: AI 요약 있는 항목만
    list = list.filter(hasAiSummary);

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
            placeholder="서명상태 선택"
          />
        </div>
        {/* ✅ AI 요약 드롭다운 제거됨 (항상 요약 있는 항목만 표시) */}
      </div>

      <div className="px-7">
        {grouped.map(([dateKey, items]) => (
          <div key={dateKey} className="mb-5">
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
