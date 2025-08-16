// src/component/pages/Owner/OwnerTreatment.tsx
import React, { useEffect, useState } from 'react';
import '@/styles/main.css';
import SimpleHeader from '@/component/header/SimpleHeader';
import OwnerRemoteTreatmentCard from '@/component/card/OwnerRemoteTreatmentCard';
import { useNavigate } from 'react-router-dom';
import { subjectMapping } from '@/utils/subjectMapping';
import { timeMapping } from '@/utils/timeMapping';
import { getTreatmentWaitingList } from '@/services/api/Owner/ownertreatment';
import type { OwnerTreatmentsByPet } from '@/types/Owner/ownertreatmentType';
import { motion, AnimatePresence } from 'framer-motion';

export default function OwnerTreatment() {
  const VITE_PHOTO_URL = import.meta.env.VITE_PHOTO_URL;
  const navigate = useNavigate();

  const handleDetailClick = async (reservationId: number, treatmentId: number) => {
    navigate(`/owner/treatment/${reservationId}`, { state: { treatmentId } });
  };

  const [treatmentData, setTreatmentData] = useState<OwnerTreatmentsByPet[]>([]);

  // 시작시간이 “진짜로” 없는지 체크 (기존 그대로 둠: 사용 안 함)
  const hasNoRealStartTime = (item: any): boolean => {
    const info = item?.treatmentInfo ?? item?.treatementInfo ?? {};
    const v = info?.startTime ?? item?.startTime ?? item?.start_time ?? null;

    if (v == null) return true;
    if (v instanceof Date) return isNaN(v.getTime());
    if (typeof v === 'number') {
      if (v >= 0 && v <= 47) return true; // 슬롯 숫자는 '시작 아님'
      const d = new Date(v);
      return isNaN(d.getTime());
    }
    const s = String(v).trim();
    if (!s) return true;
    const norm = s.replace(' ', 'T').replace(/\.\d+$/, '');
    const d = new Date(norm);
    return isNaN(d.getTime());
  };

  // ✅ 종료시간이 “진짜로” 없는지 체크(이걸로 필터링)
  const hasNoRealEndTime = (item: any): boolean => {
    const info = item?.treatmentInfo ?? item?.treatementInfo ?? {};
    const v = info?.endTime ?? item?.endTime ?? item?.end_time ?? null;

    if (v == null) return true;
    if (v instanceof Date) return isNaN(v.getTime());
    if (typeof v === 'number') {
      // 0~47 슬롯 값은 '실제 종료시각 아님'으로 간주
      if (v >= 0 && v <= 47) return true;
      const d = new Date(v);
      return isNaN(d.getTime());
    }
    const s = String(v).trim();
    if (!s) return true;
    // "YYYY-MM-DD HH:mm:ss.ssssss" 대응
    const norm = s.replace(' ', 'T').replace(/\.\d+$/, '');
    const d = new Date(norm);
    return isNaN(d.getTime());
  };

  // 정렬용: 예약시간을 분 단위로 (오름차순 코멘트는 기존 그대로 유지)
  const toMinutes = (v: any): number => {
    if (typeof v === 'number') return v * 30; // 0~47 슬롯
    const s = String(v ?? '');
    if (/^\d+$/.test(s)) return Number(s) * 30; // '23' 같은 숫자 문자열 슬롯
    const m = s.match(/\b(\d{1,2}):(\d{2})\b/);
    if (m) {
      const hh = Number(m[1]);
      const mm = Number(m[2]);
      if (Number.isFinite(hh) && Number.isFinite(mm)) return hh * 60 + mm;
    }
    return Number.POSITIVE_INFINITY;
  };

  useEffect(() => {
    const getTreatmentList = async () => {
      const data = await getTreatmentWaitingList(); // type=0
      const sortedData = (data as OwnerTreatmentsByPet[])
        .map((petTreatment) => ({
          ...petTreatment,
          treatments: petTreatment.treatments
            .filter((item) => hasNoRealEndTime(item)) // ✅ 종료 안 한 것만
            .sort((a, b) => toMinutes(b.reservationTime) - toMinutes(a.reservationTime)), // ⬅️ 시간 오름차순(기존 로직 유지)
        }))
        .filter((pt) => (pt.treatments?.length ?? 0) > 0); // 비어있으면 그룹 제거
      setTreatmentData(sortedData);
    };
    getTreatmentList();
  }, []);

  // 애니메이션
  const listVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.3 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  const isEmpty = treatmentData.length === 0;

  return (
    <div>
      <SimpleHeader text="비대면 진료" />
      <div className="px-7 pb-1 h-max space-y-4 overflow-y-scroll hide-scrollbar">
        {isEmpty ? (
          <div className="flex-1 flex items-center justify-center px-7 mt-60">
            <div className="flex flex-col items-center gap-2">
              <img src="/images/sad_dog.png" alt="nodata" className="w-20 h-20" />
              <p className="h4 text-gray-500">현재 비대면 진료 예정 항목이 없습니다.</p>
            </div>
          </div>
        ) : (
          <AnimatePresence>
            <motion.div variants={listVariants} initial="hidden" animate="show" exit="hidden" className="space-y-4">
              {treatmentData.map((treatment) =>
                treatment.treatments.map((item) => (
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
                )),
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
