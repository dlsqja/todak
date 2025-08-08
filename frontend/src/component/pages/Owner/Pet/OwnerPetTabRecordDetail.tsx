// OwnerPetTabRecordDetail.tsx (TreatmentDetailPage)
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import BackHeader from '@/component/header/BackHeader';
import ImageInputBox from '@/component/input/ImageInputBox';
import { getTreatmentDetail } from '@/services/api/Owner/ownertreatment';
import { getReservationDetail } from '@/services/api/Owner/ownerreservation';
import type { TreatmentResponse } from '@/types/Owner/ownertreatmentType';

export default function TreatmentDetailPage() {
  const { id } = useParams();
  const [record, setRecord] = useState<TreatmentResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        // id = reservationId 이므로 같은 값으로 두 API 병렬 호출
        const [treat, reservation] = await Promise.all([
          getTreatmentDetail(Number(id)),
          getReservationDetail(Number(id)),
        ]);

        console.log('치료!!!!!!',treat)
        if (!treat) {
          setRecord(null);
          return;
        }

        // 병원명/수의사명은 예약 상세에서 보강(없을 때만)
        setRecord({
          ...treat,
          hospitalName: treat.hospitalName ?? reservation.hospitalName,
          vetName: treat.vetName || reservation.vetName,
          reservation: {
            photo: reservation.photo,
            description: reservation.description,
          },
        });
      } catch (e) {
        console.error('상세 불러오기 실패:', e);
        
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
const end   = toDateSafe(record.endTime);

const fmtHHMM = (d: Date) =>
  d.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });

const formattedDate =
  start ? start.toLocaleDateString('ko-KR') : end ? end.toLocaleDateString('ko-KR') : '-';

const formattedTime =
  start && end ? `${fmtHHMM(start)} ~ ${fmtHHMM(end)}`
  : start ? fmtHHMM(start)
  : end ? fmtHHMM(end)
  : '-';


  return (
    <div className="bg-green-100 min-h-screen pb-28">
      <BackHeader text="진료 내역 상세" />

      {/* AI 요약 진단서 */}
      <section className="px-6 mt-8 space-y-3">
        <h4 className="h4 text-black">AI 요약 진단서</h4>
        <div className="bg-white rounded-[12px] shadow-[0px_5px_15px_rgba(0,0,0,0.08)] px-5 py-6 space-y-5">
          <p className="p text-black leading-relaxed whitespace-pre-wrap">{record.aiSummary || '요약 없음'}</p>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="p text-black">진료일</span>
              <span className="h4 text-black">{formattedDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="p text-black">진료시간</span>
              <span className="h4 text-black">{formattedTime}</span>
            </div>
            <div className="flex justify-between">
              <span className="p text-black">수의사</span>
              <span className="h4 text-black">{record.vetName}</span>
            </div>
          </div>

          <p className="caption text-center text-gray-400 border border-gray-100 bg-gray-100 rounded-[12px] py-2 px-3">
            본 요약문은 AI로 생성되었으며 수의사의 확인 절차를 통해 검증된 내용이지만,
            법적 효력은 없는 자료임을 명시합니다.
          </p>
        </div>
      </section>

      {/* 신청 내용 */}
    <section className="px-6 mt-9 space-y-3">
      <h4 className="h4 text-black">신청 내용</h4>

      <div className="bg-white rounded-[12px] shadow-[0px_5px_15px_rgba(0,0,0,0.08)] px-5 py-6">
        <div className="flex gap-4 items-start">
          {/* 왼쪽 이미지 박스 */}
          {record.reservation?.photo && (
            <div className="w-16 h-16 bg-gray-200 rounded-[12px] overflow-hidden flex-shrink-0">
              <img
                src={record.reservation.photo}
                alt="신청 이미지"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* 오른쪽 텍스트 */}
          <p className="p text-black leading-relaxed whitespace-pre-wrap flex-1">
            {record.reservation?.description ?? '증상이 입력되지 않았습니다.'}
          </p>
        </div>
      </div>
    </section>



    </div>
  );
}
