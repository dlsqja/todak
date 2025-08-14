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



    </div>
  );
}
