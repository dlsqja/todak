import React, { useEffect, useState } from 'react';
import ModalOnLayout from '@/layouts/ModalLayout';
import ModalTemplate from '@/component/template/ModalTemplate';
import ImageInputBox from '@/component/input/ImageInputBox';
import { timeMapping } from '@/utils/timeMapping';
import { speciesMapping } from '@/utils/speciesMapping';
import { subjectMapping } from '@/utils/subjectMapping';
import type { StaffReservationItem } from '@/types/Staff/staffreservationType';

function toHHmm(val?: unknown) {
  if (val == null) return '';
  if (typeof val === 'number' && val >= 0 && val <= 47 && timeMapping[val] != null) return timeMapping[val];
  const s = String(val);
  if (/^\d+$/.test(s)) {
    const i = Number(s);
    if (i >= 0 && i <= 47 && timeMapping[i] != null) return timeMapping[i];
  }
  const m = s.match(/\b(\d{2}):(\d{2})\b/);
  return m ? `${m[1]}:${m[2]}` : '';
}

interface Props {
  onClose: () => void;
  detail: StaffReservationItem | null;
  loading?: boolean;
  fallbackPetPhoto?: string;
}

const VetReservationDetailModal: React.FC<Props> = ({ onClose, detail, loading }) => {
  const hhmm = detail ? toHHmm(detail.reservationTime) : '';
  const species =
    detail ? (speciesMapping[detail.pet?.species as keyof typeof speciesMapping] ?? detail.pet?.species ?? '반려동물') : '';
  const ageText = detail?.pet?.age != null ? `${detail.pet.age}세` : '';
  const subject =
    detail ? (subjectMapping[detail.subject as keyof typeof subjectMapping] ?? detail.subject ?? '진료') : '';

  const toUrl = (raw?: unknown): string => {
    const s = String(raw ?? "").trim();
    if (!s) return "";
    if (/^https?:\/\//i.test(s) || /^data:image\//i.test(s)) return s;
    const base = (import.meta as any).env?.VITE_PHOTO_URL ?? "";
    if (!base) return s.startsWith("/") ? s : `/${s}`;
    return `${String(base).replace(/\/+$/, "")}/${s.replace(/^\/+/, "")}`;
  };

  const petPhotoUrl = toUrl(detail?.pet?.photo);

  const [symptomPhotoOk, setSymptomPhotoOk] = useState(false);
  useEffect(() => {
    const url = toUrl(detail?.photo);
    if (!url) {
      setSymptomPhotoOk(false);
      return;
    }
    const img = new Image();
    img.onload = () => setSymptomPhotoOk(true);
    img.onerror = () => setSymptomPhotoOk(false);
    img.src = url;
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [detail?.photo]);

  // ★★★ 추가: 증상 사진 풀스크린 뷰어 상태/핸들러
  const [photoOpen, setPhotoOpen] = useState(false);
  const symptomUrl = toUrl(detail?.photo);

  useEffect(() => {
    if (!photoOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPhotoOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [photoOpen]);

  return (
    <ModalOnLayout onClose={onClose}>
      <ModalTemplate title={`예약 시간 ${hhmm || '-'}`} onClose={onClose}>
        {loading ? (
          <div className="space-y-4">
            <div className="h-24 rounded-2xl bg-gray-100 animate-pulse" />
            <div className="h-24 rounded-2xl bg-gray-100 animate-pulse" />
          </div>
        ) : !detail ? (
          <div className="p text-center text-gray-500">예약 정보를 불러오지 못했습니다.</div>
        ) : (
          <div className="space-y-6">
            {/* 프로필 */}
            <div className="flex items-center gap-4">
              <ImageInputBox src={petPhotoUrl} />
              <div className="flex-1">
                <h3 className="h3">{detail.pet?.name ?? '-'}</h3>
                <p className="h4 text-gray-500 mt-1">
                  {[species, ageText, subject].filter(Boolean).join(' / ')}
                </p>
              </div>
            </div>

            {/* 증상 */}
            <div>
              <h4 className="h4 mb-2">증상</h4>

              {/* ★★★ 클릭하여 크게 보기: 래퍼에 onClick, 커서/호버만 추가! */}
              {symptomPhotoOk && (
                <div
                  onClick={() => setPhotoOpen(true)}
                  className="inline-block cursor-zoom-in hover:opacity-95 transition"
                  aria-label="증상 사진 크게 보기"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setPhotoOpen(true)}
                >
                  <ImageInputBox src={symptomUrl} />
                </div>
              )}

              <p className={`p whitespace-pre-wrap ${symptomPhotoOk ? 'mt-3' : ''}`}>
                {detail.description || '작성된 증상이 없습니다.'}
              </p>
            </div>
          </div>
        )}
      </ModalTemplate>

      {/* ★★★ 풀스크린 사진 뷰어 오버레이 */}
      {photoOpen && symptomPhotoOk && (
        <div
          className="fixed inset-0 z-[999] bg-black/80 flex items-center justify-center p-4"
          onClick={() => setPhotoOpen(false)}
        >
          <img
            src={symptomUrl}
            alt="증상 사진 확대"
            className="max-w-[95vw] max-h-[90vh] object-contain rounded-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()} // 이미지 클릭은 닫히지 않도록!
          />
          <button
            onClick={() => setPhotoOpen(false)}
            className="absolute top-4 right-4 rounded-full bg-white/90 px-3 py-1 text-black text-sm shadow"
            aria-label="닫기"
          >
            닫기
          </button>
        </div>
      )}
    </ModalOnLayout>
  );
};

export default VetReservationDetailModal;
