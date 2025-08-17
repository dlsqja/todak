import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import BackHeader from '@/component/header/BackHeader';
import ImageInputBox from '@/component/input/ImageInputBox';
import { getReservationDetail, getReservationRejectDetail } from '@/services/api/Owner/ownerreservation';
import type { ReservationDetail } from '@/types/Owner/ownerreservationType';

import { subjectMapping } from '@/utils/subjectMapping';
import { timeMapping } from '@/utils/timeMapping';
import { speciesMapping } from '@/utils/speciesMapping';
import { statusMapping } from '@/utils/statusMapping';

export default function OwnerReservationDetail() {
  const imageUrl = import.meta.env.VITE_PHOTO_URL;
  const navigate = useNavigate();
  const [detail, setDetail] = useState<ReservationDetail>();
  const { reservationId } = useParams<{ reservationId: string }>();
  const { isRejected, selectedPetId, selectedTab } = useLocation().state || {};
  const [rejectDetail, setRejectDetail] = useState<{ reason: string }>();

  // 반려인 경우 반려사유 get 요청 + 상세 조회
  useEffect(() => {
    if (!reservationId) return;

    (async () => {
      if (isRejected) {
        const reject = await getReservationRejectDetail(Number(reservationId));
        setRejectDetail(reject);
      }
      const d = await getReservationDetail(Number(reservationId));
      setDetail(d);
      console.log('detail:', d);
    })();
  }, [reservationId]);

  const getStatusColor = (status: string) => {
    if (status === 'WAITING') return 'bg-gray-300 text-black';
    if (status === 'APPROVED') return 'bg-green-300 text-white';
    if (status === 'REJECTED') return 'bg-red-400 text-white';
    return 'bg-gray-300 text-black';
  };

  if (!detail) {
    return (
      <>
        <BackHeader text="예약 정보" />
        <div className="pt-8 h4 text-center text-gray-500">예약 정보를 불러올 수 없습니다.</div>
      </>
    );
  }

  return (
    <div>
      <BackHeader
        text="상세 정보"
        onBack={() =>
          navigate('/owner/reservation', {
            state: { selectedPetId: selectedPetId, selectedTab: selectedTab },
          })
        }
      />

      <section className="flex flex-col gap-6 mt-4 px-7">
        {/* 상단 정보 */}
        <div className="flex justify-between border-b-1 border-gray-100 pb-4 py-3 ">
          <div className="flex flex-col gap-2">
            <div className="h4">{detail.pet.name}</div>
            <div className="flex gap-1">
              <div className="p text-center">{speciesMapping[detail.pet.species]}</div> |
              <div className="p">{detail.pet.age}세</div> | <div className="p">{subjectMapping[detail.subject]}</div>
            </div>
          </div>
          <div>
            <button className={`w-17 h-6 h5 rounded-[12px] ${getStatusColor(detail.status)}`}>
              {statusMapping[detail.status]}
            </button>
          </div>
        </div>


        {/* 수의사 / 병원 / 예약 희망 시간 */}
        <div className="flex flex-col border-b-1 border-gray-100 pb-4 gap-2">
          <div className="h4">수의사</div>
          <div className="p">{detail.vetName} 수의사</div>
        </div>
        <div className="flex flex-col border-b-1 border-gray-100 pb-4 gap-2">
          <div className="h4">병원</div>
          <div className="p">{detail.hospitalName}</div>
        </div>
        <div className="flex flex-col border-b-1 border-gray-100 pb-4 gap-2">
          <div className="h4">예약 희망 시간</div>
          <div className="p">
            {detail.reservationDay} | <span className="p">{timeMapping[detail.reservationTime]}</span>
          </div>
        </div>

        {/* ⬇️ 반려 사유 카드: 상단으로 이동 + 공통 카드 스타일 */}
        {isRejected && rejectDetail && (
          <div className="bg-white rounded-[12px] shadow-[0px_5px_15px_rgba(0,0,0,0.08)] px-5 py-4 space-y-2">
            <div className="h4">반려 사유</div>
            <p className="p text-black leading-relaxed whitespace-pre-wrap">{rejectDetail.reason}</p>
          </div>
        )}
        {/* 증상 */}
        <div className="flex flex-col border-b-1 border-gray-100 pb-4 gap-2 ">
          <div className="h4">증상</div>
          {detail.photo && (
            <div>
              <ImageInputBox src={`${imageUrl}${detail.photo}`} stroke="border-5 border-green-200" />
            </div>
          )}
          <div className="p">{detail.description}</div>
        </div>
      </section>
    </div>
  );
}
