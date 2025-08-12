import React, { useMemo, useState } from 'react';
import SelectionDropdown from '@/component/selection/SelectionDropdown';
import TreatmentSlideCard from '@/component/card/TreatmentSlideCard';
import type { VetTreatment, VetSubject } from '@/types/Vet/vettreatmentType';

const subjectKo: Record<VetSubject, string> = {
  DENTAL: '치과',
  DERMATOLOGY: '피부과',
  ORTHOPEDICS: '정형외과',
  OPHTHALMOLOGY: '안과',
};

// 날짜/시간 안전 추출
const getDatePart = (dt: unknown): string => {
  if (!dt) return '';
  if (typeof dt === 'string') {
    // "YYYY-MM-DD HH:mm:ss" | ISO
    const m = dt.match(/^(\d{4}-\d{2}-\d{2})/);
    if (m) return m[1];
    const d = new Date(dt);
    if (!isNaN(d.getTime())) return d.toISOString().slice(0, 10);
    return '';
  }
  const d = new Date(dt as any);
  return isNaN(d.getTime()) ? '' : d.toISOString().slice(0, 10);
};
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

// 펫 문자열화 (리스트필터와 동일)
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
const getPetName = (row: any): string =>
  typeof row.petName === 'string'
    ? row.petName
    : row?.petResponse?.name ?? row?.pet?.name ?? '반려동물';
const getPetInfoText = (row: any): string =>
  typeof row.petInfo === 'string'
    ? row.petInfo
    : buildPetInfoFromObj(row?.petResponse ?? row?.pet);

interface Props {
  data?: VetTreatment[];
  onCardClick: (id: number) => void;
}

export default function VetRecordDateFilter({ data = [], onCardClick }: Props) {
  const dates = useMemo(() => {
    const set = new Set(data.map((d: any) => getDatePart(d.startTime)));
    return Array.from(set).filter(Boolean).sort((a, b) => b.localeCompare(a));
  }, [data]);

  const [selectedDate, setSelectedDate] = useState('');

  const selectedList = useMemo(() => {
    return data
      .filter((d: any) => getDatePart(d.startTime) === selectedDate)
      .sort((a: any, b: any) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  }, [data, selectedDate]);

  return (
    <div className="px-7">
      <SelectionDropdown
        options={dates.map((d) => ({ value: d, label: d }))}
        value={selectedDate}
        onChange={setSelectedDate}
        placeholder="날짜 선택"
      />

      <div className="flex flex-col gap-3 mt-4">
        {!selectedDate ? (
          <h3 className="text-gray-600 text-center">날짜를 선택해주세요.</h3>
        ) : (
          <>
            <div className="text-sm text-black-600 mb-2">총 {selectedList.length}개의 진료 기록</div>
            {selectedList.map((t: any) => (
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
          </>
        )}
      </div>
    </div>
  );
}
