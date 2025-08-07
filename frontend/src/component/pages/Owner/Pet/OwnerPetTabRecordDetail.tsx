import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import BackHeader from '@/component/header/BackHeader';
import ImageInputBox from '@/component/input/ImageInputBox';
import { getReservationDetail } from '@/services/api/Owner/ownerreservation';
import type { ReservationDetailResponse } from '@/types/Owner/ownerreservationType';

export default function TreatmentDetailPage() {
  const { id } = useParams();
  const [record, setRecord] = useState<ReservationDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const data = await getReservationDetail(Number(id));
        setRecord(data);
      } catch (error) {
        console.error('상세 불러오기 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <div className="text-center mt-20">불러오는 중...</div>;
  if (!record) return <div className="text-center mt-20">진료 기록을 찾을 수 없습니다.</div>;

  const date = new Date(record.reservationTime);
  const formattedDate = date.toLocaleDateString('ko-KR'); // 예: 2025.08.07
  const formattedTime = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;

  return (
    <div className="bg-white min-h-screen pb-28">
      <BackHeader text="진료 내역 상세" />

      {/* AI 요약 진단서 */}
      <section className="px-6 mt-8 space-y-3">
        <h4 className="h4 text-black">AI 요약 진단서</h4>
        <div className="bg-white rounded-[12px] shadow-[0px_5px_15px_rgba(0,0,0,0.08)] px-5 py-6 space-y-5">
          <p className="p text-black leading-relaxed whitespace-pre-wrap">{record.summary}</p>

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

          <p className="caption text-center text-gray-500">
            본 요약문은 AI로 생성되었으며 수의사의 확인 절차를 통해 검증된 내용이지만,
            법적 효력은 없는 자료임을 명시합니다.
          </p>
        </div>
      </section>

      {/* 신청 내용 */}
      <section className="px-6 mt-9 space-y-3">
        <h4 className="h4 text-black">신청 내용</h4>
        <div className="flex gap-4">
          {record.photoUrl && <ImageInputBox src={record.photoUrl} />}
          <p className="p text-black leading-relaxed whitespace-pre-wrap">{record.description}</p>
        </div>
      </section>
    </div>
  );
}
