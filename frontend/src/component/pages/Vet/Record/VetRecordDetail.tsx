import BackHeader from '@/component/header/BackHeader';
import AiSummaryForVet from '@/component/template/AiSummaryForVet';
import { useState } from 'react';

interface CompletedReservation {
  reservation_id: number;
  owner_id: number;
  pet_id: number;
  hospital_id: number;
  vet_id: number;
  reservation_day: string;
  reservation_time: number;
  photo: string;
  ai_summary: string;
  subject: string;
  status: string;
  petName: string;
  petInfo: string;
  vetName: string;
  startTime: string;
  endTime: string;
}

const timeMapping: { [key: number]: string } = {
  0: '00:00', // 자정
  1: '00:30',
  2: '01:00',
  3: '01:30',
  4: '02:00',
  5: '02:30',
  6: '03:00',
  7: '03:30',
  8: '04:00',
  9: '04:30',
  10: '05:00',
  11: '05:30',
  12: '06:00',
  13: '06:30',
  14: '07:00',
  15: '07:30',
  16: '08:00',
  17: '08:30',
  18: '09:00',
  19: '09:30',
  20: '10:00',
  21: '10:30',
  22: '11:00',
  23: '11:30',
  24: '12:00', // 정오
  25: '12:30',
  26: '13:00',
  27: '13:30',
  28: '14:00',
  29: '14:30',
  30: '15:00',
  31: '15:30',
  32: '16:00',
  33: '16:30',
  34: '17:00',
  35: '17:30',
  36: '18:00',
  37: '18:30',
  38: '19:00',
  39: '19:30',
  40: '20:00',
  41: '20:30',
  42: '21:00',
  43: '21:30',
  44: '22:00',
  45: '22:30',
  46: '23:00',
  47: '23:30', // 자정 직전
};

export default function VetRecordDetail() {
  // 더미데이터
  const reservations: CompletedReservation[] = [
    {
      reservation_id: 1,
      owner_id: 1,
      pet_id: 1,
      hospital_id: 1,
      vet_id: 1,
      reservation_day: '2025-01-15',
      reservation_time: 34, // 17:00
      photo: '/images/미료_test.jpg',
      ai_summary: '피부에 발진이 생기고 가려움을 호소합니다. 진료 후 약을 처방받았습니다.',
      subject: '피부과',
      status: '완료',
      petName: '미료',
      petInfo: '고양이 / 2세 / 여(중성화)',
      vetName: '김수의사',
      startTime: '14:00',
      endTime: '14:30',
    },
    {
      reservation_id: 2,
      owner_id: 1,
      pet_id: 2,
      hospital_id: 1,
      vet_id: 2,
      reservation_day: '2025-01-14',
      reservation_time: 29, // 14:30
      photo: '/images/미료 _test.jpg',
      ai_summary: '식욕이 없고 설사를 하고 있습니다. 소화제를 처방받았습니다.',
      subject: '치과',
      status: '완료',
      petName: '구름이',
      petInfo: '강아지 / 5세 / 남(중성화)',
      vetName: '김수의사',
      startTime: '14:00',
      endTime: '14:30',
    },
    {
      reservation_id: 3,
      owner_id: 1,
      pet_id: 2,
      hospital_id: 1,
      vet_id: 2,
      reservation_day: '2025-01-14',
      reservation_time: 29, // 14:30
      photo: '/images/미료 _test.jpg',
      ai_summary: '식욕이 없고 설사를 하고 있습니다. 소화제를 처방받았습니다.',
      subject: '치과',
      status: '완료',
      petName: '구름이',
      petInfo: '강아지 / 5세 / 남(중성화)',
      vetName: '김수의사',
      startTime: '14:00',
      endTime: '14:30',
    },
  ];
  const [isEditing, setIsEditing] = useState(false);
  const [summary, setSummary] = useState(reservations[0].ai_summary);
  const [isSigning, setIsSigning] = useState(false);
  const [vetSignature, setVetSignature] = useState('');
  const [isSigned, setIsSigned] = useState(false);

  const handleEditSummary = () => {
    setIsEditing(true);
  };

  const handleSaveSummary = () => {
    setIsEditing(false);
    // API 호출로 서버에 저장
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setSummary(reservations[0].ai_summary); // 원래 값으로 복원
  };

  const handleSignSummary = () => {
    setIsSigning(true);
  };

  const handleCompleteSignature = () => {
    if (vetSignature.trim()) {
      setIsSigned(true);
      setIsSigning(false);
      // API 호출로 서명 정보 저장
    }
  };

  const handleCancelSignature = () => {
    setIsSigning(false);
    setVetSignature('');
  };

  return (
    <div>
      <BackHeader text="진료 기록 상세" />
      <div className="px-7">
        <AiSummaryForVet
          label="AI 요약 진단서"
          summary={summary}
          reservationDate={reservations[0].reservation_day}
          reservationTime={`${reservations[0].startTime} - ${reservations[0].endTime}`}
          vetName={reservations[0].vetName}
          onEditSummary={handleEditSummary}
          onSignSummary={handleSignSummary}
        />
      </div>
    </div>
  );
}
