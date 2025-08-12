import React, { useEffect, useState } from 'react';
import Button from '@/component/button/Button';
import { useParams, useLocation } from 'react-router-dom';
import BackHeader from '@/component/header/BackHeader';
import ImageInputBox from '@/component/input/ImageInputBox';
import { getReservationDetail, getReservationRejectDetail } from '@/services/api/Owner/ownerreservation';
import type { ReservationDetail } from '@/types/Owner/ownerreservationType';

import { subjectmapping } from '@/utils/subjectMapping';
import { timeMapping } from '@/utils/timeMapping';
import { speciesMapping } from '@/utils/speciesMapping';
import { statusMapping } from '@/utils/statusMapping';

export default function OwnerReservationDetail() {
  const [detail, setDetail] = useState<ReservationDetail>();
  const { reservationId } = useParams<{ reservationId: string }>();
  const { isRejected } = useLocation().state || {};
  const [rejectDetail, setRejectDetail] = useState<{ reason: string }>();

  //반려인 경우 반려사유 get 요청
  useEffect(() => {
    if (reservationId) {
      if (isRejected) {
        const getRejectDetail = async () => {
          const rejectDetail = await getReservationRejectDetail(Number(reservationId));
          setRejectDetail(rejectDetail);
        };
        getRejectDetail();
      }

      // 상세 정보 조회
      const reservationDetail = async (reservationId: number) => {
        const detail = await getReservationDetail(Number(reservationId));
        setDetail(detail);
        console.log('detail:', detail);
      };
      reservationDetail(Number(reservationId));
    }
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
      <BackHeader text="상세 정보" />
      <section className="flex flex-col gap-6 mt-4 px-7">
        <div className="flex justify-between border-b-1 border-gray-100 pb-4 py-3 ">
          <div className="flex flex-col gap-2">
            <div className="h4">{detail.pet.name}</div>
            <div className="flex gap-1">
              <div className="p text-center">{speciesMapping[detail.pet.species]}</div> |
              <div className="p">{detail.pet.age}세</div> | <div className="p">{subjectmapping[detail.subject]}</div>
            </div>
          </div>
          <div>
            <button className={`w-17 h-6 h5 rounded-[12px] ${getStatusColor(detail.status)}`}>
              {statusMapping[detail.status]}
            </button>
          </div>
        </div>
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
        <div className="flex flex-col border-b-1 border-gray-100 pb-4 gap-2 ">
          <div className="h4">증상</div>
          {detail.photo && (
            <div>{!detail.photo && <ImageInputBox src={detail.photo} stroke="border-5 border-green-200" />}</div>
          )}
          <div className="p">{detail.description}</div>
        </div>
        {isRejected && rejectDetail && (
          <div className="flex flex-col pb-4 gap-2">
            <div className="h3 text-red-400">반려 사유</div>
            <div className="p text-black">{rejectDetail.reason}</div>
          </div>
        )}
      </section>
    </div>
  );
}
