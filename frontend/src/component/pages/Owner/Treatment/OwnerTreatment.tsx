import React from 'react';
import '@/styles/main.css';
import SimpleHeader from '@/component/header/SimpleHeader';
import RemoteTreatmentCard from '@/component/card/RemoteTreatmentCard';
import { useNavigate } from 'react-router-dom';

export default function OwnerTreatment() {
  const navigate = useNavigate();

  // 매핑 함수들
  const speciesMapping = {
    DOG: '강아지',
    CAT: '고양이',
  } as const;

  const genderMapping = {
    MALE: '남',
    FEMALE: '여',
  } as const;

  const subjectMapping = {
    0: '치과',
    1: '피부과',
    2: '골절',
    3: '안과',
  } as const;

  // 시간을 0~47에서 실제 시간으로 변환하는 함수
  const timeToHour = (timeSlot: number): string => {
    const hour = Math.floor(timeSlot / 2);
    const minute = (timeSlot % 2) * 30;
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  };

  const handleDetailClick = (reservationId: number) => {
    navigate(`/owner/treatment/detail/${reservationId}`);
  };

  const handleRTCClick = (reservationId: number) => {
    navigate(`/owner/treatment/rtc/${reservationId}`);
  };

  // 더미데이터
  const treatmentData = [
    {
      reservation_id: 1,
      owner_id: 1,
      pet_id: 1,
      pet_name: '미료',
      species: 'CAT',
      gender: 'FEMALE',
      age: 2,
      hospital_id: 1,
      vet_id: 1,
      reservation_day: '2025-01-15',
      reservation_time: 34, // 17:00
      photo: '/images/미료_test.jpg',
      description: '피부에 발진이 생기고 가려움을 호소합니다. 진료 후 약을 처방받았습니다.',
      subject: 1, // 피부과
      status: 3, // 완료
    },
    {
      reservation_id: 2,
      owner_id: 1,
      pet_id: 2,
      pet_name: '구름이',
      species: 'CAT',
      gender: 'FEMALE',
      age: 2,
      hospital_id: 1,
      vet_id: 2,
      reservation_day: '2025-01-14',
      reservation_time: 29, // 14:30
      photo: '/images/미료_test.jpg',
      description: '식욕이 없고 설사를 하고 있습니다. 소화제를 처방받았습니다.',
      subject: 0, // 치과
      status: 3, // 완료
    },
  ];

  return (
    <div>
      <SimpleHeader text="비대면 진료" />
      <div className="px-4 space-y-4 overflow-y-auto hide-scrollbar">
        {treatmentData.map((data, index) => (
          <RemoteTreatmentCard
            key={index}
            petName={data.pet_name}
            petInfo={`${speciesMapping[data.species]} / 
            ${genderMapping[data.gender]} / 
            ${data.age}세`}
            department={subjectMapping[data.subject]}
            time={timeToHour(data.reservation_time)}
            symptom={data.description}
            photo={data.photo}
            onDetailClick={() => handleDetailClick(data.reservation_id)}
            onTreatClick={() => handleRTCClick(data.reservation_id)}
            buttonText="진료 받기"
          />
        ))}
      </div>
    </div>
  );
}
