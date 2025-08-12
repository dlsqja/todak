// src/component/pages/Vet/Record/VetRecordDetail.tsx
import React, { useEffect, useState } from 'react';
import BackHeader from '@/component/header/BackHeader';
import AiSummaryForVet from '@/component/template/AiSummaryForVet';
import { useParams, useNavigate } from 'react-router-dom';
import { getVetTreatmentDetail } from '@/services/api/Vet/vettreatment';
import type { VetTreatmentDetail } from '@/types/Vet/vettreatmentType';
import { timeMapping } from '@/utils/timeMapping';

// HH:mm로 안전 변환
const toHHmm = (dt?: unknown): string => {
  if (!dt) return '';
  if (typeof dt === 'string') {
    // "YYYY-MM-DD HH:mm:ss" or ISO
    const m = dt.match(/\b(\d{2}:\d{2})/);
    if (m) return m[1];
    const d = new Date(dt);
    if (!isNaN(d.getTime())) {
      const h = String(d.getHours()).padStart(2, '0');
      const m2 = String(d.getMinutes()).padStart(2, '0');
      return `${h}:${m2}`;
    }
    return '';
  }
  if (typeof dt === 'number' || dt instanceof Date) {
    const d = new Date(dt as any);
    if (!isNaN(d.getTime())) {
      const h = String(d.getHours()).padStart(2, '0');
      const m = String(d.getMinutes()).padStart(2, '0');
      return `${h}:${m}`;
    }
  }
  return '';
};

// 시작~끝 시간 범위 만들기: start/end 우선, 없으면 슬롯로직
const getTimeRange = (d: any): string => {
  const start = d?.startTime ?? d?.start_time;
  const end   = d?.endTime   ?? d?.end_time;
  if (start || end) {
    const a = toHHmm(start);
    const b = toHHmm(end);
    return [a, b].filter(Boolean).join(' - ');
  }
  const slot = Number(d?.reservationTime ?? d?.reservation_time);
  const s = timeMapping[slot];
  const e = timeMapping[slot + 1]; // 30분 간격 가정
  return s && e ? `${s} - ${e}` : '';
};

export default function VetRecordDetail() {
  const { id } = useParams<{ id: string }>();
  
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [detail, setDetail] = useState<VetTreatmentDetail | null>(null);
  const [summary, setSummary] = useState('');

  useEffect(() => {
    // ✅ id 없거나 숫자 변환 불가 → 즉시 에러 표시(무한 로딩 방지)
    if (!id || Number.isNaN(Number(id))) {
      setErr('잘못된 경로예요. 목록에서 다시 진입해주세요.');
      setLoading(false);
      return;
    }

    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const data = await getVetTreatmentDetail(Number(id));
        setDetail(data);
        setSummary((data as any).aiSummary ?? (data as any).ai_summary ?? '');
      } catch (e) {
        console.error('[VetRecordDetail] fetch error:', e);
        setErr('진료 상세를 불러오지 못했어요.');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

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

  const reservationDate =
    (detail as any).reservationDay ??
    (detail as any).reservation_day ??
    ((detail as any).startTime ?? '').slice(0, 10);

  const range = getTimeRange(detail);
  const vetName = (detail as any).vetName ?? '';

  return (
    <div>
      <BackHeader text="진료 기록 상세" />
      <div className="px-7">
        <AiSummaryForVet
          label="AI 요약 진단서"
          summary={summary}
          reservationDate={reservationDate}
          reservationTime={range}
          vetName={vetName}
          onEditSummary={() => {/* TODO: 수정 핸들러 연결 */}}
          onSignSummary={() => {/* TODO: 서명 핸들러 연결 */}}
        />
      </div>
    </div>
  );
}
