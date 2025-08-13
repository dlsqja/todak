import React, { useEffect, useState } from 'react';
import '@/styles/main.css';
import SimpleHeader from '@/component/header/SimpleHeader';
import VetRemoteTreatmentCard from '@/component/card/VetRemoteTreatmentCard';
import { useNavigate } from 'react-router-dom';
import { getVetTreatmentList } from '@/services/api/Vet/vettreatment';
import type { VetTreatmentListResponse } from '@/types/Vet/vettreatmentType';
import { speciesMapping } from '@/utils/speciesMapping';
import { genderMapping } from '@/utils/genderMapping';
import { subjectMapping } from '@/utils/subjectMapping';
import { timeMapping } from '@/utils/timeMapping';
import apiClient from '@/plugins/axios';

export default function VetTreatment() {
  const navigate = useNavigate();

  const handleDetailClick = (reservationId: number) => {
    navigate(`/vet/treatment/detail/${reservationId}`);
  };

  const handleRTCClick = async (treatmentId: number) => {
    await apiClient
      .post(`/treatments/vets/start/${treatmentId}`)
      .then((res) => {
        console.log('res:', res);
        navigate('/vet/treatment/rtc', {
          state: {
            treatmentId: treatmentId,
          },
        });
      })
      .catch((err) => {
        console.log('err:', err);
      });
  };

  // 더미데이터
  const [treatmentData, setTreatmentData] = useState<VetTreatmentListResponse[]>([]);

  useEffect(() => {
    const getTreatmentList = async () => {
      const treatmentData = await getVetTreatmentList();
      console.log('treatmentData:', treatmentData);
      setTreatmentData(treatmentData);
    };
    getTreatmentList();
  }, []);

  return (
    <div>
      <SimpleHeader text="비대면 진료" />
      <div className="px-4 py-1 space-y-4 max-h-full overflow-y-auto hide-scrollbar">
        {treatmentData.map((data, index) => (
          <VetRemoteTreatmentCard
            key={index}
            petName={data.petInfo.name}
            petInfo={`${speciesMapping[data.petInfo.species]} / 
            ${genderMapping[data.petInfo.gender]} / 
            ${data.petInfo.age}세`}
            department={subjectMapping[data.subject]}
            time={timeMapping[data.startTime]}
            photo={data.petInfo.photo}
            onDetailClick={() => handleDetailClick(data.reservationId)}
            onTreatClick={() => handleRTCClick(data.treatmentId)}
            buttonText="진료 하기"
          />
        ))}
      </div>
    </div>
  );
}
