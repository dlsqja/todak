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

// 상세 (모달 로직 그대로 유지)
import { getVetReservationDetail } from '@/services/api/Vet/vetreservation';
import { getStaffReservationDetail } from '@/services/api/Staff/staffreservation';
import type { StaffReservationItem } from '@/types/Staff/staffreservationType';
import VetReservationDetailModal from '@/component/pages/Vet/Treatment/VetReservationDetailModal';

type EnrichedRow = {
  base: VetTreatmentListResponse;
  reservationTimeLabel: string; // 카드에 표시용 "HH:mm"
  reservationMinutes: number; // 정렬용 (분). 없으면 Infinity
};

export default function VetTreatment() {
  const navigate = useNavigate();

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
  const hasEnded = (startVal: unknown): boolean => {
    if (typeof startVal === 'number') return startVal > 0;
    const s = String(startVal ?? '').trim();
    if (!s) return false;
    if (/^\d+$/.test(s)) return Number(s) > 0;
    const norm = s.replace(' ', 'T').replace(/\.\d+$/, '');
    const d = new Date(norm);
    if (!isNaN(d.getTime())) return true;
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

  // 상세 모달 열기 (그대로 유지)
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
    return toLocalHHmm(val as any) || '';
  };

  // "예약 시간"을 분 단위로 (정렬용)
  const reservationToMinutes = (val: unknown): number => {
    const slot = toSlotIndex(val);
    if (slot != null && slot >= 0 && slot <= 47) return slot * 30;

    const hhmm = toLocalHHmm(val as any);
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

      // 1) 치료 종료 시간 (endtime) "없는 것만" + 미완료만
      const target = (list || []).filter((it: any) => {
        const notEnded = !hasEnded(it.endTime);
        const notCompleted = it.isCompleted !== true;
        return notEnded && notCompleted;
      });

      // 2) 🔁 더 깊게 가지 않고, 목록의 reservationTime으로 직접 라벨/정렬 생성
      const enriched: EnrichedRow[] = target.map((it) => {
        const label = reservationToHHmm(it.reservationTime);
        const minutes = reservationToMinutes(it.reservationTime);
        return {
          base: it,
          reservationTimeLabel: label || '시간 미정',
          reservationMinutes: minutes,
        };
      });

      // 3) 예약 시간 최신순 정렬
      enriched.sort((a, b) => b.reservationMinutes - a.reservationMinutes);

      setRows(enriched);
    })();
  }, []);

  const isEmpty = rows.length === 0;

  return (
    <div>
      <SimpleHeader text="비대면 진료" />
      <div className="px-7 py-1 space-y-4 max-h-full overflow-y-auto hide-scrollbar">
        {isEmpty ? (
          // 오너 페이지와 동일 형식의 빈 상태 UI
          <div className="flex-1 flex items-center justify-center px-7 mt-60">
            <div className="flex flex-col items-center gap-2">
              <img src="/images/sad_dog.png" alt="nodata" className="w-20 h-20" />
              <p className="h4 text-gray-500">현재 비대면 진료 예정 항목이 없습니다.</p>
            </div>
          </div>
        ) : (
          rows.map(({ base, reservationTimeLabel }, index) => {
            const raw = base.petInfo.photo || '';
            const photoUrl =
              /^https?:\/\//i.test(raw) || /^data:image\//i.test(raw)
                ? raw
                : `${(import.meta.env.VITE_PHOTO_URL ?? '').replace(/\/+$/, '')}/${String(raw).replace(/^\/+/, '')}`;

            return (
              <VetRemoteTreatmentCard
                key={index}
                petName={base.petInfo.name}
                petInfo={`${speciesMapping[base.petInfo.species]} / ${genderMapping[base.petInfo.gender]} / ${base.petInfo.age}세`}
                department={subjectMapping[base.subject]}
                time={reservationTimeLabel}
                photo={photoUrl}
                onDetailClick={() => handleDetailClick(base.reservationId)}
                onTreatClick={() => handleRTCClick(base.treatmentId)}
                buttonText="진료 하기"
              />
            );
          })
        )}
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
