// src/component/pages/Vet/Record/VetRecordDateFilter.tsx
import React, { useMemo, useState } from 'react';
import SelectionDropdown from '@/component/selection/SelectionDropdown';
import TreatmentSlideCard from '@/component/card/TreatmentSlideCard';
import type { VetTreatment } from '@/types/Vet/vettreatmentType';

const getDatePart = (dt: string) =>
  (dt.includes('T') ? dt.split('T')[0] : dt.split(' ')[0]) || '';

const toHHmm = (dt: string) => {
  const m = dt.match(/\b(\d{2}:\d{2})/);
  if (m) return m[1];
  const d = new Date(dt);
  if (!isNaN(d.getTime())) {
    const h = String(d.getHours()).padStart(2, '0');
    const mi = String(d.getMinutes()).padStart(2, '0');
    return `${h}:${mi}`;
  }
  return '';
};

const koSpecies: Record<string, string> = { DOG: '강아지', CAT: '고양이', OTHER: '기타' };
const koGender: Record<string, string> = {
  MALE: '남',
  FEMALE: '여',
  NON: '미상',
  MALE_NEUTERING: '남(중성화)',
  FEMALE_NEUTERING: '여(중성화)',
};
const makePetInfo = (t: VetTreatment) => {
  const s = koSpecies[t.pet?.species] ?? '동물';
  const g = koGender[t.pet?.gender] ?? '';
  const age = t.pet?.age != null ? `${t.pet.age}세` : '';
  return [s, age, g].filter(Boolean).join(' / ');
};

interface Props {
  data?: VetTreatment[];
  onCardClick: (id: number) => void;
}

export default function VetRecordDateFilter({ data = [], onCardClick }: Props) {
  const dates = useMemo(() => {
    const set = new Set(data.map((d) => getDatePart(d.startTime)));
    return Array.from(set).filter(Boolean).sort((a, b) => b.localeCompare(a));
  }, [data]);

  const [selectedDate, setSelectedDate] = useState('');

  const selectedList = useMemo(() => {
    return data
      .filter((d) => getDatePart(d.startTime) === selectedDate)
      .sort((a, b) => (a.startTime > b.startTime ? 1 : -1));
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
            <div className="text-sm text-black-600 mb-2">
              총 {selectedList.length}개의 진료 기록
            </div>
            {selectedList.map((t) => (
              <TreatmentSlideCard
                key={t.treatmentId}
                time={toHHmm(t.startTime)}
                department={'진료'}
                petName={t.pet?.name ?? '반려동물'}
                petInfo={makePetInfo(t)}
                isAuthorized={true}
                is_signed={t.isCompleted}
                onClick={() => onCardClick(t.treatmentId)}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
