import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import BackHeader from '@/component/header/BackHeader';
import ImageInputBox from '@/component/input/ImageInputBox';
import { getReservationDetail, getReservationRejectDetail } from '@/services/api/Owner/ownerreservation';
import { subjectMapping } from '@/utils/subjectMapping';
import { timeMapping } from '@/utils/timeMapping';
import { speciesMapping } from '@/utils/speciesMapping';
import type { ReservationDetail } from '@/types/Owner/ownerreservationType';
import Button from '@/component/button/Button';
import apiClient from '@/plugins/axios';
import CallingIcon from '@/component/icon/CallingIcon';

export default function OwnerTreatmentDetail() {
  const navigate = useNavigate();
  const photoUrl = import.meta.env.VITE_PHOTO_URL;
  const [detail, setDetail] = useState<ReservationDetail>();
  const { reservationId } = useParams<{ reservationId: string }>();
  const { isRejected } = useLocation().state || {};
  const [rejectDetail, setRejectDetail] = useState<{ reason: string }>();
  const location = useLocation();
  const [treatmentId, setTreatmentId] = useState<number>();

  //반려인 경우 반려사유 get 요청
  useEffect(() => {
    const { treatmentId } = location.state || {};
    setTreatmentId(treatmentId);
    console.log('treatmentId:', treatmentId);
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
        <BackHeader text="상세 정보" />
        <div className="pt-8 h4 text-center text-gray-500">상세 정보를 불러올 수 없습니다.</div>
      </>
    );
  }

  const handleRTCClick = async (treatmentId: number) => {
    // const res = await apiClient
    //   .patch(`/treatments/owner/start/${treatmentId}`)
    //   .then((response) => {
    //     console.log('response:', response);
    //     navigate(`/owner/treatment/rtc`, {
    //       state: {
    //         treatmentId: treatmentId,
    //       },
    //     });
    //   })
    //   .catch((err) => {
    //     console.log('error', err);
    //     alert('아직 비대면 진료가 시작되지 않았습니다.');
    //   });
    //   console.log('res', res);
    navigate(`/owner/treatment/rtc`, {
      state: {
        treatmentId: treatmentId,
      },
    });
  };

  return (
    <div>
      <BackHeader text="상세 정보" />
      <section className="flex flex-col gap-6 mt-4 px-7">
        <div className="flex justify-between border-b-1 border-gray-100 pb-4 py-3 ">
          <div className="flex flex-col gap-2">
            <div className="h4">{detail.pet.name}</div>
            <div className="flex gap-1">
              <div className="p text-center">{speciesMapping[detail.pet.species]}</div> |
              <div className="p">{detail.pet.age}세</div> | <div className="p">{subjectMapping[detail.subject]}</div>
            </div>
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
        {/* 증상 */}
<div className="flex flex-col border-b-1 border-gray-100 pb-4 gap-2 ">
  <div className="h4">증상</div>

  {typeof detail.photo === 'string' && detail.photo.trim() !== '' && (
    <div>
      <ImageInputBox
        src={`${photoUrl}${detail.photo}`}
        stroke="border-5 border-green-200"
      />
    </div>
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
      <div className="px-7 pt-5">
        <Button className="px-7" text="진료 받기" color="green" onClick={() => handleRTCClick(treatmentId)} />
      </div>
    </div>
  );
}
