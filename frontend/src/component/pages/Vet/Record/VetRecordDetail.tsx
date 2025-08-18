// src/component/pages/Vet/Records/VetRecordDetail.tsx
import React, { useEffect, useState, useCallback } from 'react';
import BackHeader from '@/component/header/BackHeader';
import AiSummaryForVet from '@/component/template/AiSummaryForVet';
import ModalTemplate from '@/component/template/ModalTemplate';
import Button from '@/component/button/Button';
import { useParams, useNavigate } from 'react-router-dom';
import { getVetTreatmentDetail, completeVetTreatment, updateVetTreatment } from '@/services/api/Vet/vettreatment';
import type { VetTreatmentDetail } from '@/types/Vet/vettreatmentType';
import { toTimeRange } from '@/utils/timeMapping';
import ModalOnLayout from '@/layouts/ModalLayout';

// ▼ 추가: 하단 신청 정보용
import ImageInputBox from '@/component/input/ImageInputBox';
import { getVetReservationDetail } from '@/services/api/Vet/vetreservation';
import type { StaffReservationItem } from '@/types/Staff/staffreservationType';
import { speciesMapping } from '@/utils/speciesMapping';
import { genderMapping } from '@/utils/genderMapping';

export default function VetRecordDetail() {
  const { treatmentId } = useParams<{ treatmentId: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [detail, setDetail] = useState<VetTreatmentDetail | null>(null);

  // --- 모달 상태 ---
  const [editOpen, setEditOpen] = useState(false);
  const [editText, setEditText] = useState('');
  const [saving, setSaving] = useState(false);

  // ▼ 추가: 하단 신청 정보 상태
  const [reservation, setReservation] = useState<StaffReservationItem | null>(null);
  const PHOTO_URL = import.meta.env.VITE_PHOTO_URL ?? '';

  // ▼ 추가: 증상 사진 크게 보기 모달
  const [photoOpen, setPhotoOpen] = useState(false);
  const symptomPhotoUrl = React.useMemo(() => {
    const p = reservation?.photo;
    if (!p) return null;
    return /^https?:\/\//i.test(p) ? p : `${PHOTO_URL}${p}`;
  }, [reservation?.photo, PHOTO_URL]);

  useEffect(() => {
    if (!treatmentId || Number.isNaN(Number(treatmentId))) {
      setErr('잘못된 경로예요. 목록에서 다시 진입해주세요.');
      setLoading(false);
      return;
    }

    (async () => {
      try {
        setLoading(true);
        setErr(null);

        const data = await getVetTreatmentDetail(Number(treatmentId));
        setDetail(data ?? null);

        // ▼ 치료 상세에서 reservationId를 찾아 예약 상세도 함께 로드
        const rid =
          (data as any)?.reservationId ??
          (data as any)?.reservation_id ??
          (data as any)?.reservation?.reservationId ??
          (data as any)?.reservation?.id;

        if (rid) {
          try {
            const resv = await getVetReservationDetail(Number(rid));
            setReservation(resv ?? null);
          } catch {
            setReservation(null);
          }
        } else {
          setReservation(null);
        }
      } catch (e) {
        console.error('[VetRecordDetail] fetch error:', e);
        setErr('진료 상세를 불러오지 못했어요.');
      } finally {
        setLoading(false);
      }
    })();
  }, [treatmentId]);

  const handleSign = async () => {
    if (!treatmentId) return;
    try {
      await completeVetTreatment(Number(treatmentId));
      setDetail((prev) => (prev ? ({ ...prev, isCompleted: true } as VetTreatmentDetail) : prev));
      alert('서명이 완료되었습니다.');
    } catch (e) {
      console.error('[VetRecordDetail] sign error:', e);
      alert('서명에 실패했어요. 잠시 후 다시 시도해주세요.');
    }
  };

  // --- 수정 모달 열기 ---
  const openEdit = useCallback(() => {
    if (!detail) return;
    const current =
      (detail as any).aiSummary ??
      (detail as any).ai_summary ??
      (detail as any).result ??
      '';
    setEditText(current);
    setEditOpen(true);
  }, [detail]);

  // --- 수정 저장 ---
  const saveEdit = async () => {
    if (!treatmentId) return;
    try {
      setSaving(true);
      await updateVetTreatment(Number(treatmentId), { aiSummary: editText });
      // 로컬 상태 반영
      setDetail((prev) =>
        prev ? ({ ...prev, aiSummary: editText } as VetTreatmentDetail) : prev
      );
      setEditOpen(false);
      alert('저장되었습니다.');
    } catch (e) {
      console.error('[VetRecordDetail] save error:', e);
      alert('저장에 실패했어요. 잠시 후 다시 시도해주세요.');
    } finally {
      setSaving(false);
    }
  };

  // --- ESC로 닫기 ---
  useEffect(() => {
    if (!editOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setEditOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [editOpen]);

  if (loading) return <div className="p px-7 py-6">불러오는 중…</div>;

  if (err) {
    return (
      <div>
        <BackHeader text="진료 기록 상세" />
        <div className="px-7 py-6">
          <p className="p text-red-500">{err}</p>
          <button className="h5 mt-3 text-green-300" onClick={() => navigate(-1)}>
            목록으로
          </button>
        </div>
      </div>
    );
  }

  if (!detail) return null;

  // 날짜(YYYY-MM-DD)
  const reservationDate = (() => {
    const s = (detail as any).startTime ?? (detail as any).start_time ?? '';
    if (typeof s === 'string') return s.includes('T') ? s.split('T')[0] : s.split(' ')[0] || '';
    return '';
  })();

  // 시간 범위
  const timeRange = toTimeRange(
    (detail as any).startTime ?? (detail as any).start_time,
    (detail as any).endTime ?? (detail as any).end_time,
    (detail as any).reservationTime ?? (detail as any).reservation_time
  );

  const summary =
    (detail as any).aiSummary ??
    (detail as any).ai_summary ??
    '';

  const vetName =
    (detail as any).vetName ??
    (detail as any).vet_name ??
    '';

  const isCompleted =
    (detail as any).isCompleted ??
    (detail as any).is_completed ??
    false;

  // ▼ 보조: 라벨 매핑/생년월일 표기(YYMMDD)
  const mapLabel = (map: Record<string, string>, raw?: unknown) =>
    raw ? (map[String(raw).toUpperCase()] ?? String(raw)) : '-';
  const birthYYMMDD = (b?: string) => (b ? b.replaceAll('-', '').slice(2, 8) : '-');

  return (
    <div>
      <BackHeader text="진료 기록 상세" />
      <div className="px-7">
        <AiSummaryForVet
          label="AI 요약 진단서"
          summary={summary}
          reservationDate={reservationDate}
          reservationTime={timeRange || '—'}
          vetName={vetName || '—'}
          isCompleted={isCompleted}
          onEditSummary={openEdit}         // ✅ 모달 열기
          onSignSummary={handleSign}
        />
      </div>

      {/* ====== 수정 모달 ====== */}
      {editOpen && (
        <ModalOnLayout onClose={() => setEditOpen(false)}>
          <ModalTemplate title="요약본 수정" onClose={() => setEditOpen(false)}>
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="w-full h-40 block border-1 rounded-[12px] border-gray-400 px-5 pt-3 pb-3 text-black placeholder:text-gray-500 resize-none"
            />
            <div className="flex gap-3 mt-4">
              <Button color="gray" text="취소" onClick={() => setEditOpen(false)} />
              <Button color="green" text={saving ? '저장 중…' : '저장하기'} onClick={saveEdit} />
            </div>
          </ModalTemplate>
        </ModalOnLayout>
      )}

      {/* ====== 하단 신청 정보 ====== */}
      <section className="px-7 mt-5 space-y-3">
        <h4 className="h4 text-black">신청 내용</h4>
        <div className="bg-white rounded-[12px] shadow-[0px_5px_15px_rgba(0,0,0,0.08)] px-5 py-6 space-y-5">
          {/* 증상 이미지 아래에 설명 */}
          {(reservation?.photo || reservation?.description) && (
            <div className="flex flex-col gap-3 items-start">
              {symptomPhotoUrl ? (
                <div
                  className="w-22 h-22 rounded-[16px] overflow-hidden shrink-0 cursor-zoom-in"
                  onClick={() => setPhotoOpen(true)}
                  title="이미지 크게 보기"
                >
                  <ImageInputBox src={symptomPhotoUrl} stroke="border-5 border-green-200" />
                </div>
              ) : null}
              {reservation?.description ? (
                <p className="p text-black whitespace-pre-wrap">{reservation.description}</p>
              ) : null}
            </div>
          )}

          {/* 반려동물 정보 */}
          {reservation?.pet && (
            <div className="space-y-1">
              <h4 className="h4 text-black">반려동물 정보</h4>
              <p className="p text-black">이름 : {reservation.pet.name ?? '-'}</p>
              <p className="p text-black">
                나이 : {reservation.pet.age != null ? `${reservation.pet.age}세` : '-'}
              </p>
              <p className="p text-black">
                동물 종 : {mapLabel(speciesMapping as any, reservation.pet.species)}
              </p>
              <p className="p text-black">
                성별 : {mapLabel(genderMapping as any, reservation.pet.gender)}
              </p>
            </div>
          )}

          {/* 보호자 정보 */}
          {reservation?.owner && (
            <div className="space-y-1">
              <h4 className="h4 text-black">보호자 정보</h4>
              <p className="p text-black">이름 : {reservation.owner.name ?? '-'}</p>
              <p className="p text-black">생년월일 : {birthYYMMDD(reservation.owner.birth)}</p>
              <p className="p text-black">전화번호 : {reservation.owner.phone ?? '-'}</p>
            </div>
          )}
        </div>
      </section>

      {/* ▼ 증상 사진 크게 보기 모달 */}
      {photoOpen && symptomPhotoUrl && (
        <ModalOnLayout onClose={() => setPhotoOpen(false)}>
          <ModalTemplate title="증상 사진" onClose={() => setPhotoOpen(false)}>
            <img
              src={symptomPhotoUrl}
              alt="증상 사진"
              className="max-h-[70vh] w-full object-contain rounded-[12px]"
            />
            <div className="flex justify-end mt-4">
              <Button color="green" text="닫기" onClick={() => setPhotoOpen(false)} />
            </div>
          </ModalTemplate>
        </ModalOnLayout>
      )}
    </div>
  );
}
