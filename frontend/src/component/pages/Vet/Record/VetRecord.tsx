import React, { useState } from 'react';
import SimpleHeader from '@/component/header/SimpleHeader';
import TabGroupTreatList from '@/component/navbar/TabGroupTreatList';
import VetRecordListFilter from './VetRecordListFilter';
import VetRecordDateFilter from './VetRecordDateFilter';
import { useNavigate } from 'react-router-dom';

// 더미데이터
const treatmentlist: any[] = [
  {
    treatment_id: 1,
    reservation_id: 101,
    vet_id: 201,
    pet_id: 301,
    hospital_id: 401,
    subject: 0, // 치과
    is_completed: false,
    is_signed: false,
    start_time: '2024-06-01 10:00:00',
    end_time: '2024-06-01 10:30:00',
    result: '진료 결과: 건강 양호',
    ai_summary: 'AI 요약: 건강에 이상 없음',
    petName: '멍멍이',
    petInfo: '강아지 / 3세 / 여(중성화)',
  },
  {
    treatment_id: 2,
    reservation_id: 101,
    vet_id: 201,
    pet_id: 301,
    hospital_id: 401,
    subject: 0, // 치과
    is_completed: false,
    is_signed: false,
    start_time: '2024-06-01 11:00:00',
    end_time: '2024-06-01 11:30:00',
    result: '진료 결과: 건강 양호',
    ai_summary: 'AI 요약: 건강에 이상 없음',
    petName: '멍멍이',
    petInfo: '강아지 / 3세 / 여(중성화)',
  },
  {
    treatment_id: 3,
    reservation_id: 102,
    vet_id: 202,
    pet_id: 302,
    hospital_id: 402,
    subject: 1, // 피부과
    is_completed: true,
    is_signed: true,
    start_time: '2024-06-02 11:00:00',
    end_time: '2024-06-02 11:40:00',
    result: '진료 결과: 피부 알레르기',
    ai_summary: 'AI 요약: 알레르기 치료 필요',
    petName: '냥냥이',
    petInfo: '고양이 / 2세 / 남(중성화)',
  },
  {
    treatment_id: 4,
    reservation_id: 103,
    vet_id: 203,
    pet_id: 303,
    hospital_id: 403,
    subject: 1,
    is_completed: false,
    is_signed: false,
    start_time: '2024-06-03 09:30:00',
    end_time: '2024-06-03 10:00:00',
    result: '진료 결과: 예방접종 완료',
    ai_summary: 'AI 요약: 추가 조치 불필요',
    petName: '댕댕이',
    petInfo: '강아지 / 1세 / 여(미중성화)',
  },
  {
    treatment_id: 5,
    reservation_id: 104,
    vet_id: 204,
    pet_id: 304,
    hospital_id: 404,
    subject: 3,
    is_completed: true,
    is_signed: false,
    start_time: '2024-06-04 14:00:00',
    end_time: '2024-06-04 14:20:00',
    result: '진료 결과: 소화불량',
    ai_summary: 'AI 요약: 식이조절 권장',
    petName: '고양이',
    petInfo: '고양이 / 4세 / 남(중성화)',
  },
  {
    treatment_id: 6,
    reservation_id: 105,
    vet_id: 205,
    pet_id: 305,
    hospital_id: 405,
    subject: 2,
    is_completed: true,
    is_signed: true,
    start_time: '2024-06-05 16:00:00',
    end_time: '2024-06-05 16:50:00',
    result: '진료 결과: 골절 치료',
    ai_summary: 'AI 요약: 추가 진료 필요',
    petName: '강아지',
    petInfo: '강아지 / 5세 / 여(중성화)',
  },
];

export default function VetRecord() {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState('목록형');

  const handleTabSelect = (tab: string) => {
    setSelectedTab(selectedTab === tab ? '목록형' : tab);
  };

  return (
    <div className="flex flex-col gap-3">
      <SimpleHeader text="진료 기록" />
      <TabGroupTreatList onSelect={handleTabSelect} />

      {selectedTab === '목록형' ? (
        <VetRecordListFilter data={treatmentlist} onCardClick={(id) => navigate(`/vet/records/detail/${id}`)} />
      ) : (
        <VetRecordDateFilter data={treatmentlist} onCardClick={(id) => navigate(`/vet/records/detail/${id}`)} />
      )}
    </div>
  );
}
