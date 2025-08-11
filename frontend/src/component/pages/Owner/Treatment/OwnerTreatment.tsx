import React, { useEffect, useRef, useState } from 'react';
import '@/styles/main.css';
import SimpleHeader from '@/component/header/SimpleHeader';
import RemoteTreatmentCard from '@/component/card/RemoteTreatmentCard';
import { useNavigate } from 'react-router-dom';
import { genderMapping } from '@/utils/genderMapping';
import { speciesMapping } from '@/utils/speciesMapping';
import { subjectmapping } from '@/utils/subjectMapping'; // 소문자 주의
import { timeMapping } from '@/utils/timeMapping';
import { getReservations } from '@/services/api/Owner/ownerreservation';
import { getTreatments } from '@/services/api/Owner/ownertreatment';
import type { OwnerTreatmentsByPet } from '@/types/Owner/ownertreatmentType';

export default function OwnerTreatment() {
  const VITE_PHOTO_URL = import.meta.env.VITE_PHOTO_URL;
  const navigate = useNavigate();
  // 상세 정보 페이지 이동
  const handleDetailClick = (reservationId: number) => {
    navigate(`/owner/reservation/${reservationId}`);
  };
  // 비대면 진료(RTC) 페이지 이동
  const handleRTCClick = (reservationId: number) => {
    navigate(`/owner/treatment/rtc/${reservationId}`);
  };

  const [treatmentData, setTreatmentData] = useState<OwnerTreatmentsByPet[]>([]);
  useEffect(() => {
    const getTreatmentList = async () => {
      const treatmentData = await getTreatments();
      console.log('treatmentData:', treatmentData);
      setTreatmentData(treatmentData);
    };
    getTreatmentList();
  }, []);

  return (
    <div>
      <SimpleHeader text="비대면 진료" />
      <div className="px-4 pb-1 h-max space-y-4 overflow-y-scroll hide-scrollbar">
        {treatmentData.flatMap((treatment) =>
          treatment.treatments.map((item) => {
            console.log('item:', item);
            return (
              <RemoteTreatmentCard
                key={item.reservationId}
                petName={treatment.petResponse.name}
                department={subjectmapping[item.subject]}
                photo={`${VITE_PHOTO_URL}${treatment.petResponse.photo}`}
                onDetailClick={() => handleDetailClick(item.reservationId)}
                onTreatClick={() => handleRTCClick(item.reservationId)}
                buttonText="진료 받기"
              />
            );
          }),
        )}
      </div>
    </div>
  );
}
