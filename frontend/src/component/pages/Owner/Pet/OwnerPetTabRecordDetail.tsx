// OwnerPetTabRecordDetail.tsx (TreatmentDetailPage)
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import BackHeader from '@/component/header/BackHeader';
import ImageInputBox from '@/component/input/ImageInputBox';
import { getTreatmentDetail } from '@/services/api/Owner/ownertreatment';
import { getReservationDetail } from '@/services/api/Owner/ownerreservation';
import type { TreatmentResponse } from '@/types/Owner/ownertreatmentType';

export default function TreatmentDetailPage() {
  const { id } = useParams();
  const [record, setRecord] = useState<TreatmentResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const PHOTO_URL = import.meta.env.VITE_PHOTO_URL;
  const navigate = useNavigate();
  const petId = useLocation().state?.petId;
  useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        const [treat, reservation] = await Promise.all([
          getTreatmentDetail(Number(id)),
          getReservationDetail(Number(id)),
        ]);

        if (!treat) {
          // ✅ 목록에서 못 찾는 경우: 예약 상세로 화면을 채움(시간/요약은 비워둠)
          setRecord({
            treatmentId: reservation.reservationId,
            reservation: {
              photo: reservation.photo ?? undefined,
              description: reservation.description.trim() ?? '',
            },
            vetName: reservation.vetName ?? '',
            pet: reservation.pet, // ← 타입 보강했으니 사용 가능
            hospitalName: reservation.hospitalName, // ← 예약에서 보강
            subject: reservation.subject as any,
            startTime: '', // 목록에서만 오는 값이라 비움
            endTime: '',
            aiSummary: '', // 없으면 빈 문자열
          });
          return;
        }

        // ✅ 정상 케이스: treat에 예약 정보 보강
        setRecord({
          ...treat,
          hospitalName: treat.hospitalName ?? reservation.hospitalName,
          vetName: treat.vetName || reservation.vetName,
          reservation: {
            photo: reservation.photo ?? undefined,
            description: reservation.description?.trim() || undefined,
          },
        });
      } catch (e) {
        console.error('상세 불러오기 실패:', e);
        setRecord(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <div className="text-center mt-20">불러오는 중...</div>;
  if (!record) return <div className="text-center mt-20">진료 기록을 찾을 수 없습니다.</div>;

  const hasTime = record.startTime && !Number.isNaN(new Date(record.startTime).getTime());
  const date = hasTime ? new Date(record.startTime) : null;
  // 기존 formattedDate/Time 계산부를 아래로 교체
  const toDateSafe = (s?: string) => {
    if (!s) return null;
    const d = new Date(s);
    return Number.isNaN(d.getTime()) ? null : d;
  };

  const start = toDateSafe(record.startTime);
  const end = toDateSafe(record.endTime);

  const fmtHHMM = (d: Date) => d.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });

  const formattedDate = start ? start.toLocaleDateString('ko-KR') : end ? end.toLocaleDateString('ko-KR') : '-';

  const formattedTime =
    start && end ? `${fmtHHMM(start)} ~ ${fmtHHMM(end)}` : start ? fmtHHMM(start) : end ? fmtHHMM(end) : '-';

  return (
    <div className="bg-gray-50 pb-28">
      <BackHeader
        onBack={() => {
          navigate('/owner/pet?tab=record', {
            state: {
              selectedTab: '진료 내역',
              selectedPetId: petId,
            },
          });
        }}
        text="진료 내역 상세"
      />

      {/* AI 요약 진단서 */}
      <section className="px-6 mt-8 space-y-3">
        <h4 className="h4 text-black">진단서</h4>
        <div className="bg-white rounded-[12px] shadow-[0px_5px_15px_rgba(0,0,0,0.08)] px-5 py-6 space-y-5">
          <div className="space-y-3">
            <div className="flex justify-between">
              <p className="p text-black">진료일</p>
              <h4 className="h4 text-black">{formattedDate}</h4>
            </div>
            <div className="flex justify-between">
              <p className="p text-black">진료시간</p>
              <h4 className="h4 text-black">{formattedTime}</h4>
            </div>
            <div className="flex justify-between">
              <p className="p text-black">수의사</p>
              <h4 className="h4 text-black">{record.vetName}</h4>
            </div>
          </div>
          <p className="h4 text-black leading-relaxed whitespace-pre-wrap">{record.aiSummary || '요약 없음'}</p>
          <p className="caption text-center text-gray-500 border border-gray-100 bg-gray-100 rounded-[12px] py-2 px-3">
            본 요약문은 AI로 생성되었으며 수의사의 확인 절차를 통해
            <br />
            <span>검증된 내용이지만, 법적 효력은 없는 자료임을 명시합니다.</span>
          </p>
        </div>
      </section>
      <section className="px-6 mt-8 space-y-3"></section>

      {/* 진료 내용 */}
      <section className="px-6 mt-9 space-y-3">
        <h4 className="h4 text-black">신청 내용</h4>
        <div className="bg-white rounded-[12px] shadow-[0px_5px_15px_rgba(0,0,0,0.08)] px-5 py-6 space-y-5">
          <div className="space-y-3">
            {record.reservation?.photo && record.reservation.photo.trim() !== '' && (
              <ImageInputBox src={`${PHOTO_URL}${record.reservation.photo}`} stroke="border-5 border-green-200" />
            )}
            <h4 className="p text-black">{record.reservation?.description}</h4>
          </div>
        </div>
      </section>
    </div>
  );
}
