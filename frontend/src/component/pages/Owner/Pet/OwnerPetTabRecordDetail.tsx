// OwnerPetTabRecordDetail.tsx (TreatmentDetailPage)
import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import BackHeader from '@/component/header/BackHeader';
import ImageInputBox from '@/component/input/ImageInputBox';
import { getTreatmentDetail } from '@/services/api/Owner/ownertreatment';
import { getReservationDetail } from '@/services/api/Owner/ownerreservation';
import type { TreatmentResponse } from '@/types/Owner/ownertreatmentType';
import { toTimeRange } from '@/utils/timeMapping';

export default function TreatmentDetailPage() {
  const { id } = useParams();
  const [record, setRecord] = useState<TreatmentResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [reservationTimeSlot, setReservationTimeSlot] = useState<number | string | undefined>(undefined);
  const [reservationDayText, setReservationDayText] = useState<string | undefined>(undefined);
  const PHOTO_URL = import.meta.env.VITE_PHOTO_URL;
  const navigate = useNavigate();
  const petId = useLocation().state?.petId;

  // (위치 이동) 요약문 애니메이션 훅 — 모든 렌더에서 항상 실행되도록 상단에 둠
  const summaryText = record?.aiSummary || '요약된 진료 내용이 없습니다.';
  const [revealed, setRevealed] = useState(false);
  const [skipAll, setSkipAll] = useState(false);
  const charGrid = useMemo(
    () => summaryText.split('\n').map((line) => Array.from(line)),
    [summaryText]
  );
  useEffect(() => {
    setSkipAll(false);
    setRevealed(false);
    const t = setTimeout(() => setRevealed(true), 30);
    return () => clearTimeout(t);
  }, [summaryText]);

  // ✅ 통일 파서: DB문자열은 앞 10자리, ISO 오프셋 없으면 Z 붙여 UTC로 간주 후 로컬 Y-M-D
  const getLocalYMD = (v?: unknown): string => {
    if (v == null) return '';
    if (typeof v === 'number' || v instanceof Date) {
      const d = new Date(v as any);
      if (Number.isNaN(d.getTime())) return '';
      const yy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      return `${yy}-${mm}-${dd}`;
    }
    const raw = String(v).trim();
    if (!raw) return '';
    const m = raw.match(/^(\d{4}-\d{2}-\d{2})\b/);
    if (m) return m[1];
    let iso = raw.replace(' ', 'T');
    if (/T/.test(iso) && !/(Z|[+\-]\d{2}:?\d{2})$/i.test(iso)) iso += 'Z';
    iso = iso.replace(/\.(\d{3})\d+$/, '.$1');
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '';
    const yy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yy}-${mm}-${dd}`;
  };

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const [treat, reservation] = await Promise.all([
          getTreatmentDetail(Number(id)),
          getReservationDetail(Number(id)),
        ]);

        // 예약 슬롯 & 날짜 보관
        const rTime =
          (reservation as any)?.reservationTime ??
          (reservation as any)?.reservation_time ??
          (reservation as any)?.reservationSlot ??
          (reservation as any)?.reservation_slot ??
          undefined;
        setReservationTimeSlot(rTime);

        const rDay =
          (reservation as any)?.reservationDay ??
          (reservation as any)?.reservation_day ??
          undefined;
        setReservationDayText(typeof rDay === 'string' ? rDay : undefined);

        if (!treat) {
          setRecord({
            treatmentId: reservation.reservationId,
            reservation: {
              photo: reservation.photo ?? undefined,
              description: reservation.description.trim() ?? '',
            },
            vetName: reservation.vetName ?? '',
            pet: reservation.pet,
            hospitalName: reservation.hospitalName,
            subject: reservation.subject as any,
            startTime: '',
            endTime: '',
            aiSummary: '',
          });
          return;
        }

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

  // 진료일: startTime → endTime → reservationDay
  const reservationDate =
    getLocalYMD((record as any)?.startTime ?? (record as any)?.start_time) ||
    getLocalYMD((record as any)?.endTime   ?? (record as any)?.end_time)   ||
    getLocalYMD(reservationDayText) ||
    '-';

  // 시간 범위
  const reservationTimeText =
    toTimeRange(
      (record as any)?.startTime ?? (record as any)?.start_time,
      (record as any)?.endTime   ?? (record as any)?.end_time,
      reservationTimeSlot
    ) || '-';

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
        <h4 className="h4 text-black">AI 요약 진단서</h4>
        <div className="bg-white rounded-[12px] shadow-[0px_5px_15px_rgba(0,0,0,0.08)] px-5 py-6 space-y-5">
          <div className="space-y-3">
            <div className="flex justify-between">
              <p className="p text-black">진료일</p>
              <h4 className="h4 text-black">{reservationDate}</h4>
            </div>
            <div className="flex justify-between">
              <p className="p text-black">진료시간</p>
              <h4 className="h4 text-black">{reservationTimeText}</h4>
            </div>
            <div className="flex justify-between">
              <p className="p text-black">수의사</p>
              <h4 className="h4 text-black">{record.vetName || '-'}</h4>
            </div>
          </div>

          {/* 요약문 애니메이션 + 건너뛰기 */}
          <div className="flex justify-end -mt-2">
            {!skipAll && summaryText && summaryText !== '요약 내용이 없습니다.' && (
              <button
                onClick={() => {
                  setSkipAll(true);
                  setRevealed(true);
                }}
                className="caption text-gray-400 hover:text-gray-600 underline"
              >
                건너뛰기
              </button>
            )}
          </div>

          <div
            className="p text-black !leading-6 !tracking-tight whitespace-pre-wrap"
            aria-live="polite"
            aria-atomic="false"
          >
            {charGrid.map((chars, rowIndex) => (
              <div key={`row-${rowIndex}`} className="inline-block w-full align-top">
                {chars.length === 0 ? (
                  <br />
                ) : (
                  chars.map((ch, colIndex) => {
                    const delayMs = (rowIndex + colIndex) * 18;
                    const style: React.CSSProperties = skipAll
                      ? { opacity: 1, transform: 'translate(0,0)' }
                      : {
                          opacity: revealed ? 1 : 0,
                          transform: revealed ? 'translate(0,0)' : 'translate(10px,10px)',
                          transitionProperty: 'opacity, transform',
                          transitionDuration: '260ms',
                          transitionTimingFunction: 'cubic-bezier(0.22,1,0.36,1)',
                          transitionDelay: `${delayMs}ms`,
                        };
                    return (
                      <span key={`c-${rowIndex}-${colIndex}`} style={style}>
                        {ch === ' ' ? '\u00A0' : ch}
                      </span>
                    );
                  })
                )}
              </div>
            ))}
          </div>

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
