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
import { toTimeRange, timeMapping, toLocalHHmm } from '@/utils/timeMapping';

import type { StaffReservationItem, Gender, Species, Subject } from '@/types/Staff/staffreservationType';

import StatusBadge from '@/component/state/StatusBadge';

export default function StaffReservationDetail() {
  const photoUrl = import.meta.env.VITE_PHOTO_URL;
  const navigate = useNavigate();

  const { state } = useLocation() as { state?: { reservationId?: number } };
  const params = useParams<{ reservationId?: string }>();
  const reservationId = state?.reservationId ?? (params.reservationId ? Number(params.reservationId) : undefined);

  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState<StaffReservationItem | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [isApproveOpen, setApproveOpen] = useState(false);
  const [isRejectOpen, setRejectOpen] = useState(false);

  // 🔒 중복 클릭 방지
  const [actioning, setActioning] = useState(false);

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
        console.log('data:', data);
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

  // 안전 라벨 유틸
  const mapEnum = <T extends string>(map: Record<string, string>, raw: T | undefined, fallback = '') =>
    raw ? map[String(raw)] ?? String(raw) : fallback;

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
  const petSpecies = mapEnum<Species>(speciesMapping, detail?.pet?.species as Species, '기타');
  const petGender = mapEnum<Gender>(genderMapping, detail?.pet?.gender as Gender, '미상');

  // 배지 키(REQUESTED/APPROVED/REJECTED → 0/1/2)
  const badgeKey = useMemo<number>(() => {
    const s = String(detail?.status ?? '').toUpperCase();
    if (s === 'APPROVED') return 1;
    if (s === 'REJECTED') return 2;
    return 0;
  }, [detail?.status]);

  // 사진 있으면만 노출
  const hasPhoto = useMemo(() => !!(detail?.photo && String(detail.photo).trim().length > 0), [detail?.photo]);

  const isRequested = useMemo(() => String(detail?.status ?? '').toUpperCase() === 'REQUESTED', [detail?.status]);

  // 승인 처리 → 모달 닫고 → 목록으로 이동
  const handleApprove = async () => {
    if (actioning) return;
    try {
      setActioning(true);
      await approveStaffReservation(reservationId);
      setApproveOpen(false);
      // alert('승인 완료');
      navigate(-1); // 목록으로 복귀
    } catch {
      alert('승인 처리 실패. 잠시 후 다시 시도해주세요.');
    } finally {
      setActioning(false);
    }
  };

  // 반려 처리 → 모달 닫고 → 목록으로 이동
  const handleReject = async (reason: string) => {
    if (actioning) return;
    try {
      setActioning(true);
      await rejectStaffReservation(reservationId, reason);
      setRejectOpen(false);
      // alert('반려 처리 완료');
      navigate(-1); // 목록으로 복귀
    } catch (e) {
      console.error(e);
      alert('반려 처리 실패. 잠시 후 다시 시도해주세요.');
    } finally {
      setActioning(false);
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
            {/* "반려동물 정보" 제목 라인 + 상태 배지(오른쪽) */}
            <div className="flex justify-between items-center mb-0">
              <h4 className="h4">반려동물 정보</h4>
              <StatusBadge type="reservation" statusKey={badgeKey} />
            </div>

            {/* 내용은 그대로(이름/나이/종/성별/체중) */}
            <MultiContent
              title=""
              contents={
                [
                  `이름 : ${detail.pet?.name ?? '-'}`,
                  `나이 : ${detail.pet?.age ?? '-'}세`,
                  `동물 종류 : ${petSpecies}`,
                  `성별 : ${petGender}`,
                  detail.pet?.weight ? `체중 : ${detail.pet?.weight}kg` : '',
                ].filter(Boolean) as string[]
              }
            />

            {/* 보호자 정보 */}
            <MultiContent
              title="보호자 정보"
              contents={
                [
                  `이름 : ${detail.owner?.name ?? '-'}`,
                  detail.owner?.birth ? `생년월일 : ${detail.owner.birth}` : '',
                  `전화번호 : ${detail.owner?.phone ?? '-'}`,
                ].filter(Boolean) as string[]
              }
            />

            {/* 재진 여부 */}
            <SingleContent title="재진 여부" content={detail.isRevisit ? '재진' : '초진'} />

            {/* 수의사 및 진료 과목 */}
            <SingleContent
              title="희망 수의사 및 진료 과목"
              content={`${detail.vetName ?? '-'} | ${subjectLabel || '-'}`}
            />

            {/* 예약 희망 시간 */}
            <SingleContent title="예약 희망 시간" content={timeLabel || '-'} />

            {/* 증상 */}
            <div className="space-y-2">
              <h4 className="h4">증상</h4>
              {hasPhoto && (
                <div className="flex gap-2">
                  <ImageInputBox src={`${photoUrl}${detail.photo}`} stroke="border border-gray-300" />
                </div>
              )}
              <p className="p whitespace-pre-wrap">{detail.description || '-'}</p>
            </div>

            {/* ✅ 요청 상태에서만 버튼 노출 (중복 승인/반려 방지) */}
            {isRequested && (
              <div className="grid grid-cols-2 gap-4 pt-4">
                <Button
                  color="lightgreen"
                  text={actioning ? '처리 중…' : '진료 반려'}
                  onClick={() => !actioning && setRejectOpen(true)}
                />
                <Button
                  color="green"
                  text={actioning ? '처리 중…' : '진료 승인'}
                  onClick={() => !actioning && setApproveOpen(true)}
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* 승인 모달 → 승인 확정시 목록으로 이동 */}
      {isApproveOpen && (
        <ReservationApprovalModal
          onClose={() => setApproveOpen(false)}
          data={{
            time: timeLabel || '-',
            doctor: detail?.vetName || '-',
            department: subjectLabel || '-',
            petName: detail?.pet?.name || '-',
            petAge: detail?.pet?.age ? `${detail?.pet?.age}세` : '-',
            petType: petSpecies || '-',
            ownerName: detail?.owner?.name || '-',
            ownerPhone: detail?.owner?.phone || '-',
          }}
          onConfirm={handleApprove}
        />
      )}

      {/* 반려 모달 → 반려 확정시 목록으로 이동 */}
      {isRejectOpen && detail && (
        <StaffReservationRejectModal
          onClose={() => setRejectOpen(false)}
          onSubmit={(reason) => handleReject(reason)}
          petName={detail.pet?.name ?? '-'}
          petInfo={`${petSpecies || '-'} / ${detail.pet?.age ?? '-'}세`}
          time={timeLabel || '-'}
          doctor={detail.vetName ?? '-'}
          photo={`${photoUrl}${detail.pet?.photo}`}
        />
      )}
    </div>
  );
}
