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

// 상세
import { getVetReservationDetail } from '@/services/api/Vet/vetreservation';
import { getStaffReservationDetail } from '@/services/api/Staff/staffreservation';
import type { StaffReservationItem } from '@/types/Staff/staffreservationType';
import VetReservationDetailModal from '@/component/pages/Vet/Treatment/VetReservationDetailModal';

export default function VetTreatment() {
  const navigate = useNavigate();

  const [treatmentData, setTreatmentData] = useState<VetTreatmentListResponse[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalDetail, setModalDetail] = useState<StaffReservationItem | null>(null);

  // 슬롯 인덱스 추출 (숫자/문자 모두 안전 처리)
  const toSlotIndex = (v: unknown): number | null => {
    if (typeof v === 'number') return Number.isFinite(v) ? v : null;
    const s = String(v ?? '');
    if (/^\d+$/.test(s)) return Number(s);
    return null;
    // (※ 서버가 HH:mm을 주는 경우가 생기면 여기서 파싱해서 분/슬롯으로 바꿔도 됨)
  };

  const handleDetailClick = async (reservationId: number) => {
    setModalOpen(true);
    setModalLoading(true);
    setModalDetail(null);
    try {
      let res: StaffReservationItem | null = null;
      try {
        res = await getVetReservationDetail(reservationId);
      } catch {
        res = await getStaffReservationDetail(reservationId);
      }
      setModalDetail(res ?? null);
    } catch {
      setModalDetail(null);
    } finally {
      setModalLoading(false);
    }
  };

  const handleRTCClick = async (treatmentId: number) => {
    await apiClient
      .post(`/treatments/vets/start/${treatmentId}`)
      .then(() => {
        navigate('/vet/treatment/rtc', { state: { treatmentId } });
      })
      .catch((err) => console.log('err:', err));
  };

  useEffect(() => {
    (async () => {
      const list = await getVetTreatmentList();

      // 1) 미시작 + 미완료만 남기기
      const filtered = (list || []).filter((it: any) => {
        const slot = toSlotIndex(it.startTime);
        const started = slot != null && slot > 0;   // 0 또는 null/undefined → 미시작으로 간주
        const completed = it.isCompleted === true;
        return !started && !completed;
      });

      // 2) 시간 오름차순 정렬 (값이 없거나 0이면 맨 뒤)
      const sorted = [...filtered].sort((a, b) => {
        const sa = toSlotIndex((a as any).startTime);
        const sb = toSlotIndex((b as any).startTime);
        const va = sa == null || sa === 0 ? Infinity : sa;
        const vb = sb == null || sb === 0 ? Infinity : sb;
        return va - vb;
      });

      setTreatmentData(sorted);
    })();
  }, []);

  return (
    <div>
      <SimpleHeader text="비대면 진료" />
      <div className="px-7 py-1 space-y-4 max-h-full overflow-y-auto hide-scrollbar">
        {treatmentData.map((data, index) => {
          const slot = toSlotIndex(data.startTime);
          const timeLabel =
            slot != null && slot >= 0 && timeMapping[slot] ? timeMapping[slot] : '시간 미정';

          return (
            <VetRemoteTreatmentCard
              key={index}
              petName={data.petInfo.name}
              petInfo={`${speciesMapping[data.petInfo.species]} / ${genderMapping[data.petInfo.gender]} / ${data.petInfo.age}세`}
              department={subjectMapping[data.subject]}
              time={timeLabel}
              photo={data.petInfo.photo}
              onDetailClick={() => handleDetailClick(data.reservationId)}   // 모달 오픈
              onTreatClick={() => handleRTCClick(data.treatmentId)}
              buttonText="진료 하기"
            />
          );
        })}
      </div>

      {modalOpen && (
        <VetReservationDetailModal
          onClose={() => setModalOpen(false)}
          detail={modalDetail}
          loading={modalLoading}
        />
      )}
    </div>
  );
}
