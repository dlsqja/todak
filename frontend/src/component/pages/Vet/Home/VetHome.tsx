import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '@/styles/main.css';
import OwnerTreatmentSimpleCard from '@/component/card/OwnerTreatmentSimpleCard';
import TreatmentSlideCard from '@/component/card/TreatmentSlideCard';
import TreatmentSlideList from '@/component/card/TreatmentSlideList';

interface CompletedReservation {
  reservation_id: number;
  owner_id: number;
  pet_id: number;
  hospital_id: number;
  vet_id: number;
  reservation_day: string;
  reservation_time: number;
  photo: string;
  description: string;
  subject: string;
  status: string;
  petName: string;
  petInfo: string;
}

export default function VetHome() {
  const navigate = useNavigate();
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
      description: '피부에 발진이 생기고 가려움을 호소합니다. 진료 후 약을 처방받았습니다.',
      subject: '피부과',
      status: '완료',
      petName: '미료',
      petInfo: '고양이 / 2세 / 여(중성화)',
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
      description: '식욕이 없고 설사를 하고 있습니다. 소화제를 처방받았습니다.',
      subject: '치과',
      status: '완료',
      petName: '구름이',
      petInfo: '강아지 / 5세 / 남(중성화)',
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
      description: '식욕이 없고 설사를 하고 있습니다. 소화제를 처방받았습니다.',
      subject: '치과',
      status: '완료',
      petName: '구름이',
      petInfo: '강아지 / 5세 / 남(중성화)',
    },
    {
      reservation_id: 4,
      owner_id: 1,
      pet_id: 2,
      hospital_id: 1,
      vet_id: 2,
      reservation_day: '2025-01-14',
      reservation_time: 29, // 14:30
      photo: '/images/미료 _test.jpg',
      description: '식욕이 없고 설사를 하고 있습니다. 소화제를 처방받았습니다.',
      subject: '치과',
      status: '완료',
      petName: '구름이',
      petInfo: '강아지 / 5세 / 남(중성화)',
    },
  ];

  return (
    <div>
      <h3 className="h3 mx-7 pt-13">OOO수의사님 반갑습니다!</h3>
      <h3 className="h3 mx-7 mb-2">어플 사용이 처음이신가요?</h3>
      <button
        onClick={() => navigate('/guide')}
        className="h5 mx-7 px-5 py-1 rounded-full inline-block 
        bg-green-300 text-green-100 hover:bg-green-200 transition"
      >
        비대면 진료 가이드
      </button>
      <h3 className="mx-7 h3 mt-11">비대면 진료 예정 목록</h3>
      <div className="overflow-x-auto overflow-visible snap-x snap-mandatory scroll-smooth hide-scrollbar mx-7 pt-3 pb-6">
        <div className="w-max flex gap-4 h-full p-3">
          {reservations.map((reservation) => (
            <div key={reservation.reservation_id}>
              <OwnerTreatmentSimpleCard
                time={timeMapping[reservation.reservation_time]}
                department={reservation.subject}
                petName={reservation.petName}
                petInfo={reservation.petInfo}
              />
            </div>
          ))}
        </div>
      </div>
      <h3 className="mx-7 h3">진료 기록 검토</h3>
      <div className="mx-7 ">
        <TreatmentSlideList />
      </div>
    </div>
  );
}
