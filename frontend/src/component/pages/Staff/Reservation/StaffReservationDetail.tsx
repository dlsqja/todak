// src/component/pages/Staff/Reservation/StaffReservationDetail.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import BackHeader from '@/component/header/BackHeader';
import SingleContent from '@/component/text/SingleContent';
import MultiContent from '@/component/text/MultipleContent';
import ImageInputBox from '@/component/input/ImageInputBox';
import Button from '@/component/button/Button';

import ReservationApprovalModal from './StaffReservationApprovalModal';
import StaffReservationRejectModal from './StaffReservationRejectModal';

import {
  getStaffReservationDetail,
  approveStaffReservation,
  rejectStaffReservation,
} from '@/services/api/Staff/staffreservation';

import { genderMapping } from '@/utils/genderMapping';
import { speciesMapping } from '@/utils/speciesMapping';
import { subjectMapping } from '@/utils/subjectMapping';
import { statusMapping } from '@/utils/statusMapping';
import { toTimeRange, timeMapping, toLocalHHmm } from '@/utils/timeMapping';

import type {
  StaffReservationItem,
  Gender,
  Species,
  Subject,
  ReservationStatus,
} from '@/types/Staff/staffreservationType';

export default function StaffReservationDetail() {
  const navigate = useNavigate();

  // state 또는 URL 파라미터로 식별자 수용
  const { state } = useLocation() as { state?: { reservationId?: number } };
  const params = useParams<{ reservationId?: string }>();
  const reservationId =
    state?.reservationId ?? (params.reservationId ? Number(params.reservationId) : undefined);

  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState<StaffReservationItem | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [isApproveOpen, setApproveOpen] = useState(false);
  const [isRejectOpen, setRejectOpen] = useState(false);

  // 식별자 없으면 즉시 가드
  if (!reservationId) {
    return (
      <div className="space-y-6">
        <BackHeader text="예약 상세" />
        <div className="px-7 py-6">
          <p className="p text-red-500">예약 식별자가 없습니다.</p>
          <div className="mt-4">
            <Button color="gray" text="목록으로" onClick={() => navigate(-1)} />
          </div>
        </div>
      </div>
    );
  }

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const data = await getStaffReservationDetail(reservationId);
        if (!alive) return;
        setDetail(data);
      } catch {
        if (!alive) return;
        setError('예약 정보를 불러오지 못했어요.');
        setDetail(null);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [reservationId]);

  // 안전한 라벨 생성기
  const mapEnum = <T extends string>(
    map: Record<string, string>,
    raw: T | undefined,
    fallback = ''
  ) => (raw ? map[String(raw)] ?? String(raw) : fallback);

  const timeLabel = useMemo(() => {
    const slotLike = detail?.reservationTime;
    if (slotLike == null) return '';
    const rangeFromSlot = toTimeRange(undefined, undefined, slotLike as any);
    if (rangeFromSlot) return `${detail?.reservationDay ?? ''} ${rangeFromSlot}`;
    if (typeof slotLike === 'number') return `${detail?.reservationDay ?? ''} ${timeMapping[slotLike] ?? ''}`;
    const hhmm = toLocalHHmm(String(slotLike));
    return `${detail?.reservationDay ?? ''} ${hhmm}`;
  }, [detail?.reservationDay, detail?.reservationTime]);

  const subjectLabel = mapEnum<Subject>(subjectMapping, detail?.subject, '');
  const statusLabel = mapEnum<ReservationStatus>(statusMapping, detail?.status, '');
  const petSpecies = mapEnum<Species>(speciesMapping, detail?.pet?.species as Species, '기타');
  const petGender = mapEnum<Gender>(genderMapping, detail?.pet?.gender as Gender, '미상');
  const revisitLabel = detail?.isRevisit ? '재진' : '초진';

  // 모달에 넘길 데이터
  const modalData = {
    time: timeLabel || '-',
    doctor: detail?.vetName || '-',
    department: subjectLabel || '-',
    petName: detail?.pet?.name || '-',
    petAge: detail?.pet?.age ? `${detail?.pet?.age}세` : '-',
    petType: petSpecies || '-',
    ownerName: detail?.owner?.name || '-',
    ownerPhone: detail?.owner?.phone || '-',
  };

  const handleApprove = async () => {
    try {
      await approveStaffReservation(reservationId);
      // 서버 최신값으로 싱크
      const fresh = await getStaffReservationDetail(reservationId);
      setDetail(fresh ?? (prev => prev && ({ ...prev, status: 'APPROVED' } as any)));
      setApproveOpen(false);
      alert('승인 완료');
    } catch {
      alert('승인 처리 실패. 잠시 후 다시 시도해주세요.');
    }
  };

  const handleReject = async (reason: string) => {
  try {
    await rejectStaffReservation(reservationId, reason);  // ✅ 문자열만 전달
    const fresh = await getStaffReservationDetail(reservationId);  // 싱크 재조회 권장
    setDetail(fresh ?? (prev => (prev ? { ...prev, status: 'REJECTED' } : prev)));
    setRejectOpen(false);
    alert('반려 처리 완료');
  } catch (e) {
    console.error(e);
    alert('반려 처리 실패. 잠시 후 다시 시도해주세요.');
  }
};

  return (
    <div>
      <BackHeader text="예약 상세" />

      <div className="px-7 py-6 space-y-6">
        {loading ? (
          <p className="p">불러오는 중…</p>
        ) : error ? (
          <>
            <p className="p text-red-500">{error}</p>
            <Button color="gray" text="목록으로" onClick={() => navigate(-1)} />
          </>
        ) : !detail ? (
          <>
            <p className="p">데이터가 없습니다.</p>
            <Button color="gray" text="목록으로" onClick={() => navigate(-1)} />
          </>
        ) : (
          <>
            {/* 반려동물 정보 */}
            <MultiContent
              title="반려동물 정보"
              contents={[
                `이름 : ${detail.pet?.name ?? '-'}`,
                `나이 : ${detail.pet?.age ?? '-'}세`,
                `동물 종류 : ${petSpecies}`,
                `성별 : ${petGender}`,
                detail.pet?.weight ? `체중 : ${detail.pet?.weight}kg` : '',
              ].filter(Boolean) as string[]}
            />

            {/* 보호자 정보 */}
            <MultiContent
              title="보호자 정보"
              contents={[
                `이름 : ${detail.owner?.name ?? '-'}`,
                detail.owner?.birth ? `생년월일 : ${detail.owner.birth}` : '',
                `전화번호 : ${detail.owner?.phone ?? '-'}`,
              ].filter(Boolean) as string[]}
            />

            {/* 재진 여부 + 상태 */}
            <SingleContent title="재진 여부" content={revisitLabel} />
            <SingleContent title="현재 상태" content={statusLabel || '-'} />

            {/* 수의사 및 진료과목 */}
            <SingleContent
              title="희망 수의사 및 진료 과목"
              content={`${detail.vetName ?? '-'} | ${subjectLabel || '-'}`}
            />

            {/* 예약 희망 시간 */}
            <SingleContent title="예약 희망 시간" content={timeLabel || '-'} />

            {/* 증상 */}
            <div className="space-y-4">
              <h4 className="h4">증상</h4>
              <div className="flex gap-4">
                <ImageInputBox src={detail.photo} stroke="border border-gray-300" />
              </div>
              <p className="p whitespace-pre-wrap">{detail.description || '-'}</p>
            </div>

            {/* 버튼 */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <Button color="lightgreen" text="진료 반려" onClick={() => setRejectOpen(true)} />
              <Button color="green" text="진료 승인" onClick={() => setApproveOpen(true)} />
            </div>
          </>
        )}
      </div>

      {/* 승인 모달 (요약만 보여주고 확인 시 승인 처리) */}
      {isApproveOpen && (
      <ReservationApprovalModal
        onClose={() => setApproveOpen(false)}
        data={modalData}
        onConfirm={async () => {
          // 여기만 실제 승인 로직!
          await approveStaffReservation(reservationId);
          const fresh = await getStaffReservationDetail(reservationId);
          setDetail(fresh);
          setApproveOpen(false);
          alert('승인 완료');
        }}
      />
)}
      {/* 반려 모달 */}
      {isRejectOpen && detail && (
  <StaffReservationRejectModal
  onClose={() => setRejectOpen(false)}
  onSubmit={(reason) => handleReject(reason)}
  petName={detail.pet?.name ?? '-'}
  petInfo={`${petSpecies || '-'} / ${detail.pet?.age ?? '-'}세`}          // ✅ '강아지' 등 한글 라벨 사용
  time={timeLabel || '-'}
  doctor={detail.vetName ?? '-'}
  photo={detail.photo}
/>

)}

    </div>
  );
}
