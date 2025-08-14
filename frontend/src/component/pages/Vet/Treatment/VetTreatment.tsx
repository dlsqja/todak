// src/component/pages/Vet/Treatment/VetTreatment.tsx
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
import { timeMapping, toLocalHHmm } from '@/utils/timeMapping';
import apiClient from '@/plugins/axios';

// 상세
import { getVetReservationDetail } from '@/services/api/Vet/vetreservation';
import { getStaffReservationDetail } from '@/services/api/Staff/staffreservation';
import type { StaffReservationItem } from '@/types/Staff/staffreservationType';
import VetReservationDetailModal from '@/component/pages/Vet/Treatment/VetReservationDetailModal';

type EnrichedRow = {
  base: VetTreatmentListResponse;
  reservationTimeLabel: string; // 카드에 표시용 "HH:mm"
  reservationMinutes: number;   // 정렬용 (분). 없으면 Infinity
};

export default function VetTreatment() {
  const navigate = useNavigate();

  // 목록은 가공된 행으로 보관(표시/정렬 편의)
  const [rows, setRows] = useState<EnrichedRow[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalDetail, setModalDetail] = useState<StaffReservationItem | null>(null);

  // 슬롯 인덱스 추출 (숫자/문자 모두 안전 처리)
  const toSlotIndex = (v: unknown): number | null => {
    if (typeof v === 'number') return Number.isFinite(v) ? v : null;
    const s = String(v ?? '');
    if (/^\d+$/.test(s)) return Number(s);
    return null;
  };

  // ✅ "진료 시작 여부"를 모든 포맷에서 정확히 판별
  // - number: >0이면 시작됨, 0이면 미시작
  // - "숫자문자열": >0이면 시작됨, "0"은 미시작
  // - 날짜/시간 문자열(ISO/DB): 유효 Date면 시작됨
  // - 그 외/빈 값: 미시작
  const hasStarted = (startVal: unknown): boolean => {
    if (typeof startVal === 'number') return startVal > 0;
    const s = String(startVal ?? '').trim();
    if (!s) return false;
    if (/^\d+$/.test(s)) return Number(s) > 0;
    // 날짜/시간 문자열로 판단
    const norm = s.replace(' ', 'T').replace(/\.\d+$/, '');
    const d = new Date(norm);
    if (!isNaN(d.getTime())) return true;
    // 마지막 보조: "HH:mm" 파싱 성공 시도
    return !!toLocalHHmm(s as any);
  };

  // RTC 시작 (⚠️ 수정 금지 요청)
  const handleRTCClick = async (treatmentId: number) => {
    await apiClient
      .post(`/treatments/vets/start/${treatmentId}`)
      .then(() => {
        navigate('/vet/treatment/rtc', { state: { treatmentId } });
      })
      .catch((err) => console.log('err:', err));
  };

  // 상세 모달 열기
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

  // "예약 시간"을 HH:mm 텍스트로
  const reservationToHHmm = (val: unknown): string => {
    const slot = toSlotIndex(val);
    if (slot != null && slot >= 0 && slot <= 47 && timeMapping[slot]) {
      return timeMapping[slot];
    }
    // 서버가 HH:mm/ISO 등을 줄 수 있으므로 util로 안전 파싱
    return toLocalHHmm(val as any) || '';
  };

  // "예약 시간"을 분 단위로 (정렬용)
  const reservationToMinutes = (val: unknown): number => {
    const slot = toSlotIndex(val);
    if (slot != null && slot >= 0 && slot <= 47) return slot * 30;

    const hhmm = toLocalHHmm(val as any); // "HH:mm" 기대
    if (hhmm) {
      const m = hhmm.match(/^(\d{2}):(\d{2})$/);
      if (m) {
        const h = Number(m[1]);
        const mm = Number(m[2]);
        if (Number.isFinite(h) && Number.isFinite(mm)) return h * 60 + mm;
      }
    }
    return Number.POSITIVE_INFINITY; // 시간 미정 → 맨 뒤로
  };

  useEffect(() => {
    (async () => {
      // type=0 목록
      const list = await getVetTreatmentList();

      // 1) 치료 시작(startTime) "없는 것만" + 미완료만
      const target = (list || []).filter((it: any) => {
        const notStarted = !hasStarted(it.startTime);
        const notCompleted = it.isCompleted !== true;
        return notStarted && notCompleted;
      });

      // 2) 각 항목의 "예약 상세"에서 reservationTime 확보(수의사 경로 우선)
      const details = await Promise.all(
        target.map(async (it) => {
          try {
            try {
              return await getVetReservationDetail(it.reservationId);
            } catch {
              return await getStaffReservationDetail(it.reservationId);
            }
          } catch {
            return null;
          }
        })
      );

      // 3) 표시에 필요한 데이터로 변환 + 예약 시간으로 정렬
      const enriched: EnrichedRow[] = target.map((it, idx) => {
        const det = details[idx];
        const label = reservationToHHmm(det?.reservationTime);
        const minutes = reservationToMinutes(det?.reservationTime);
        return {
          base: it,
          reservationTimeLabel: label || '시간 미정',
          reservationMinutes: minutes,
        };
      });

      enriched.sort((a, b) => a.reservationMinutes - b.reservationMinutes);

      setRows(enriched);
    })();
  }, []);

  return (
    <div>
      <SimpleHeader text="비대면 진료" />
      <div className="px-7 py-1 space-y-4 max-h-full overflow-y-auto hide-scrollbar">
        {rows.map(({ base, reservationTimeLabel }, index) => (
          <VetRemoteTreatmentCard
            key={index}
            petName={base.petInfo.name}
            petInfo={`${speciesMapping[base.petInfo.species]} / ${genderMapping[base.petInfo.gender]} / ${base.petInfo.age}세`}
            department={subjectMapping[base.subject]}
            time={reservationTimeLabel}                              
            photo={base.petInfo.photo}
            onDetailClick={() => handleDetailClick(base.reservationId)} 
            onTreatClick={() => handleRTCClick(base.treatmentId)}         
            buttonText="진료 하기"
          />
        ))}
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
