import React, { useEffect, useState } from 'react';
import '@/styles/main.css';
import SimpleHeader from '@/component/header/SimpleHeader';
import OwnerRemoteTreatmentCard from '@/component/card/OwnerRemoteTreatmentCard';
import { useNavigate } from 'react-router-dom';
import { subjectMapping } from '@/utils/subjectMapping'; // 소문자 주의
import { timeMapping } from '@/utils/timeMapping';
import { getTreatmentWaitingList } from '@/services/api/Owner/ownertreatment';
import type { OwnerTreatmentsByPet } from '@/types/Owner/ownertreatmentType';
import { motion, AnimatePresence } from 'framer-motion'; // 애니메이션 추가

export default function OwnerTreatment() {
  const VITE_PHOTO_URL = import.meta.env.VITE_PHOTO_URL;
  const navigate = useNavigate();

  // 상세 정보 페이지 이동
  const handleDetailClick = async (reservationId: number, treatmentId: number) => {
    navigate(`/owner/treatment/${reservationId}`, {
      state: {
        treatmentId: treatmentId,
      },
    });
  };

  const [treatmentData, setTreatmentData] = useState<OwnerTreatmentsByPet[]>([]);

  useEffect(() => {
    const getTreatmentList = async () => {
      const treatmentData = await getTreatmentWaitingList();
      console.log('treatmentData:', treatmentData);

      // starttime이 null이 아닌 항목만 필터링하고 시간 기준 최신순으로 정렬
      const sortedData = treatmentData.map((petTreatment) => ({
        ...petTreatment,
        treatments: petTreatment.treatments
          .filter((item) => item.treatmentInfo.startTime == null) // starttime이 null인 것만 포함함
          .sort((a, b) => {
            // reservationTime을 기준으로 내림차순 정렬 (최신순)
            return b.reservationTime - a.reservationTime;
          }),
      }));

      setTreatmentData(sortedData);
    };
    getTreatmentList();
  }, []);

  // 애니메이션 설정: 리스트 전체 애니메이션을 위한 부모 요소
  const listVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3, // 항목 간의 순차 애니메이션 딜레이
      },
    },
  };

  // 항목마다 개별 애니메이션
  const itemVariants = {
    hidden: { opacity: 0, y: 20 }, // 위에서 아래로 나타나기 위한 초기 위치
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } }, // 애니메이션 종료 시 원위치
  };

  return (
    <div>
      <SimpleHeader text="비대면 진료" />
      <div className="px-4 pb-1 h-max space-y-4 overflow-y-scroll hide-scrollbar">
        <AnimatePresence>
          <motion.div
            variants={listVariants}
            initial="hidden"
            animate="show"
            exit="hidden"
            className="space-y-4" // 부모 요소에 gap 적용
          >
            {treatmentData.map((treatment) =>
              treatment.treatments.map((item) => {
                return (
                  <motion.div key={item.reservationId} variants={itemVariants}>
                    <OwnerRemoteTreatmentCard
                      petName={treatment.petResponse.name}
                      petInfo={`진료 예정 시간 : ${timeMapping[item.reservationTime]}`}
                      department={subjectMapping[item.subject]}
                      photo={`${VITE_PHOTO_URL}${treatment.petResponse.photo}`}
                      buttonText="상세 정보"
                      onClick={() => handleDetailClick(item.reservationId, item.treatmentId)}
                    />
                  </motion.div>
                );
              }),
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
