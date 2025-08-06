import React, { useState, useEffect } from 'react';
import '@/styles/main.css';
import SelectionDropdown from '@/component/selection/SelectionDropdown';
import TreatmentSlideCard from '@/component/card/TreatmentSlideCard';

interface Props {
  data?: any[];
  onCardClick: (id: number) => void;
}

export default function VetRecordListFilter({ data = [], onCardClick }: Props) {
  const [filteredData, setFilteredData] = useState<any[]>(data);
  const [selectedSubject, setSelectedSubject] = useState<string>('전체');
  const [selectedSigned, setSelectedSigned] = useState<string>('전체');

  // 진료과목 옵션
  const subjectOptions = [
    { value: '전체', label: '전체 과목' },
    { value: '0', label: '치과' },
    { value: '1', label: '피부과' },
    { value: '2', label: '골절' },
    { value: '3', label: '안과' },
  ];

  // 서명상태 옵션
  const signedOptions = [
    { value: '전체', label: '전체 상태' },
    { value: 'false', label: '검토 대기' },
    { value: 'true', label: '서명 완료' },
  ];

  // 필터링 및 정렬 로직을 useEffect 내부에서 직접 처리
  useEffect(() => {
    let filtered = [...data];

    // 진료과목 필터링
    if (selectedSubject !== '전체') {
      filtered = filtered.filter((item) => item.subject === parseInt(selectedSubject));
    }

    // 서명상태 필터링
    if (selectedSigned !== '전체') {
      const signedValue = selectedSigned === 'true';
      filtered = filtered.filter((item) => item.is_signed === signedValue);
    }

    // 최신순 정렬
    filtered = filtered.sort((a, b) => {
      const aTime = a.start_time.split(' ')[1];
      const bTime = b.start_time.split(' ')[1];
      const toSeconds = (t: string) => {
        const [h, m, s] = t.split(':').map(Number);
        return h * 3600 + m * 60 + s;
      };
      return toSeconds(bTime) - toSeconds(aTime);
    });

    setFilteredData(filtered);
  }, [selectedSubject, selectedSigned, data]);

  const formatTime = (dateTimeString: string) => {
    return dateTimeString.slice(11, 16);
  };

  const subjectMap: { [key: number]: string } = {
    0: '치과',
    1: '피부과',
    2: '골절',
    3: '안과',
  };
  const getSubjectName = (subjectId: number) => subjectMap[subjectId] || '기타';

  return (
    <>
      <div className="px-7 flex gap-3">
        <div className="flex-1">
          <SelectionDropdown
            options={subjectOptions}
            value={selectedSubject}
            onChange={setSelectedSubject}
            placeholder="진료과목 선택"
          />
        </div>
        <div className="flex-1">
          <SelectionDropdown
            options={signedOptions}
            value={selectedSigned}
            onChange={setSelectedSigned}
            placeholder="서명상태 선택"
          />
        </div>
      </div>
      <div className="px-7">
        <div className="text-sm text-black-600 mb-2">총 {filteredData.length}개의 진료 기록</div>
        <div className="flex flex-col gap-3">
          {filteredData.map((treatment) => (
            <TreatmentSlideCard
              key={treatment.treatment_id}
              time={formatTime(treatment.start_time)}
              department={getSubjectName(treatment.subject)}
              petName={treatment.petName}
              petInfo={treatment.petInfo}
              isAuthorized={true}
              is_signed={treatment.is_signed}
              onClick={() => onCardClick(treatment.treatment_id)}
            />
          ))}
        </div>
      </div>
    </>
  );
}
