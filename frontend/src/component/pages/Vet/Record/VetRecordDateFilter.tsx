import { useState } from 'react';
import SelectionDropdown from '@/component/selection/SelectionDropdown';
import TreatmentSlideCard from '@/component/card/TreatmentSlideCard';

interface Props {
  data?: any[];
  onCardClick: (id: number) => void;
}

export default function VetRecordDateFilter({ data = [], onCardClick }: Props) {
  // 날짜 리스트 추출
  const dateList = Array.from(new Set(data.map((item) => item.start_time.split(' ')[0]))).sort((a, b) =>
    b.localeCompare(a),
  );
  const [selectedDate, setSelectedDate] = useState('');

  // 선택된 날짜의 기록만 필터링하고 시간순 오름차순 정렬
  const SelectedDate = data
    .filter((item) => item.start_time.split(' ')[0] === selectedDate)
    .sort((a, b) => {
      // 시간 부분만 추출하여 오름차순 정렬 (가장 이른 시간부터)
      const aTime = a.start_time.split(' ')[1];
      const bTime = b.start_time.split(' ')[1];

      // 시:분:초를 초 단위로 변환
      const toSeconds = (t: string) => {
        const [h, m, s] = t.split(':').map(Number);
        return h * 3600 + m * 60 + s;
      };

      return toSeconds(aTime) - toSeconds(bTime); // 오름차순 (a - b)
    });

  const subjectMap: { [key: number]: string } = {
    0: '치과',
    1: '피부과',
    2: '골절',
    3: '안과',
  };
  const getSubjectName = (subjectId: number) => subjectMap[subjectId] || '기타';

  return (
    <div className="px-7">
      <SelectionDropdown
        options={dateList.map((date) => ({ value: date, label: date }))}
        value={selectedDate}
        onChange={setSelectedDate}
        placeholder="날짜 선택"
      />
      <div className="flex flex-col gap-3 mt-4">
        {SelectedDate.length === 0 ? (
          <h3 className="text-gray-600 text-center">날짜를 선택해주세요.</h3>
        ) : (
          <>
            <div className="text-sm text-black-600 mb-2">총 {SelectedDate.length}개의 진료 기록</div>
            {SelectedDate.map((treatment) => (
              <TreatmentSlideCard
                key={treatment.treatment_id}
                time={treatment.start_time.slice(11, 16)}
                department={getSubjectName(treatment.subject)}
                petName={treatment.petName}
                petInfo={treatment.petInfo}
                isAuthorized={true}
                is_signed={treatment.is_signed}
                onClick={() => onCardClick(treatment.treatment_id)}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
