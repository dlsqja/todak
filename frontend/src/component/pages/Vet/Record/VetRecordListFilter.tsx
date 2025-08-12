import React, { useMemo, useState } from 'react';
import '@/styles/main.css';
import SelectionDropdown from '@/component/selection/SelectionDropdown';
import TreatmentSlideCard from '@/component/card/TreatmentSlideCard';
import type { VetTreatment, VetSubject } from '@/types/Vet/vettreatmentType';

interface Props {
  data?: VetTreatment[];
  onCardClick: (id: number) => void;
}

const subjectKo: Record<VetSubject, string> = {
  DENTAL: '치과',
  DERMATOLOGY: '피부과',
  ORTHOPEDICS: '정형외과',
  OPHTHALMOLOGY: '안과',
};

const subjectOptions = [
  { value: 'ALL', label: '전체 과목' },
  { value: 'DENTAL', label: '치과' },
  { value: 'DERMATOLOGY', label: '피부과' },
  { value: 'ORTHOPEDICS', label: '정형외과' },
  { value: 'OPHTHALMOLOGY', label: '안과' },
] as const;

const signedOptions = [
  { value: 'ALL', label: '전체 상태' },
  { value: 'false', label: '검토 대기' },
  { value: 'true', label: '서명 완료' },
] as const;

// 안전한 HH:mm 변환
const toHHmm = (dt: unknown): string => {
  if (!dt) return '';
  if (typeof dt === 'string') {
    const m = dt.match(/\b(\d{2}:\d{2})/);
    if (m) return m[1];
    const d = new Date(dt);
    if (!isNaN(d.getTime())) {
      const h = String(d.getHours()).padStart(2, '0');
      const m2 = String(d.getMinutes()).padStart(2, '0');
      return `${h}:${m2}`;
    }
    return '';
  }
  const d = new Date(dt as any);
  if (!isNaN(d.getTime())) {
    const h = String(d.getHours()).padStart(2, '0');
    const m = String(d.getMinutes()).padStart(2, '0');
    return `${h}:${m}`;
  }
  return '';
};

// 펫 정보 문자열화
const speciesKo = { DOG: '강아지', CAT: '고양이', OTHER: '기타' } as const;
const genderKo: Record<string, string> = {
  MALE: '남', FEMALE: '여',
  MALE_NEUTERING: '남(중성화)', FEMALE_NEUTERING: '여(중성화)',
  NON: '성별 없음',
};
const buildPetInfoFromObj = (p: any): string => {
  if (!p || typeof p !== 'object') return '';
  const species = speciesKo[(p.species as keyof typeof speciesKo) ?? ''] ?? (p.species ?? '');
  const age = (p.age ?? '') !== '' ? `${p.age}세` : '';
  const gender = genderKo[p.gender] ?? (p.gender ?? '');
  return [species, age, gender].filter(Boolean).join(' / ');
};
const getPetName = (row: any): string => {
  // 우선순위: 명시적 문자열 -> 객체의 name
  return typeof row.petName === 'string'
    ? row.petName
    : row?.petResponse?.name ?? row?.pet?.name ?? '반려동물';
};
const getPetInfoText = (row: any): string => {
  if (typeof row.petInfo === 'string') return row.petInfo;
  return buildPetInfoFromObj(row?.petResponse ?? row?.pet);
};

export default function VetRecordListFilter({ data = [], onCardClick }: Props) {
  const [selectedSubject, setSelectedSubject] = useState<'ALL' | VetSubject>('ALL');
  const [selectedSigned, setSelectedSigned] = useState<'ALL' | 'true' | 'false'>('ALL');

  const filteredData = useMemo(() => {
    let list = [...data];

    if (selectedSubject !== 'ALL') {
      list = list.filter((it) => it.subject === selectedSubject);
    }
    if (selectedSigned !== 'ALL') {
      const want = selectedSigned === 'true';
      list = list.filter((it) => Boolean((it as any).isSigned) === want);
    }

    // 최신 시작시간 순 (desc)
    list.sort((a: any, b: any) => (new Date(b.startTime).getTime() - new Date(a.startTime).getTime()));
    return list;
  }, [data, selectedSubject, selectedSigned]);

  return (
    <>
      <div className="px-7 flex gap-3">
        <div className="flex-1">
          <SelectionDropdown
            options={subjectOptions as any}
            value={selectedSubject}
            onChange={(v) => setSelectedSubject(v as any)}
            placeholder="진료과목 선택"
          />
        </div>
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
        <div className="text-sm text-black-600 mb-2">총 {filteredData.length}개의 진료 기록</div>
        <div className="flex flex-col gap-3">
          {filteredData.map((t: any) => (
            <TreatmentSlideCard
              key={t.treatmentId}
              time={toHHmm(t.startTime)}
              department={subjectKo[t.subject] ?? '기타'}
              petName={getPetName(t)}
              petInfo={getPetInfoText(t)}
              isAuthorized={true}
              is_signed={Boolean(t.isSigned)}
              onClick={() => onCardClick(t.treatmentId)}
            />
          ))}
        </div>
      </div>
    </>
  );
}
