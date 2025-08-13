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
}

const VetReservationDetailModal: React.FC<Props> = ({ onClose, detail, loading }) => {
  const hhmm = detail ? toHHmm(detail.reservationTime) : '';
  const species =
    detail ? (speciesMapping[detail.pet?.species as keyof typeof speciesMapping] ?? detail.pet?.species ?? '반려동물') : '';
  const ageText = detail?.pet?.age != null ? `${detail.pet.age}세` : '';
  const subject =
    detail ? (subjectMapping[detail.subject as keyof typeof subjectMapping] ?? detail.subject ?? '진료') : '';

  // ⬇️ "실제 로드 가능한" 증상 사진인지 모달에서만 검사
  const [symptomPhotoOk, setSymptomPhotoOk] = useState(false);
  useEffect(() => {
    const raw = String(detail?.photo ?? '').trim().toLowerCase();
    // 명시적으로 비었거나 'null'/'undefined' 같은 값이면 바로 숨김
    if (!raw || raw === 'null' || raw === 'undefined') {
      setSymptomPhotoOk(false);
      return;
    }
    const img = new Image();
    img.onload = () => setSymptomPhotoOk(true);
    img.onerror = () => setSymptomPhotoOk(false);
    img.src = String(detail?.photo); // 상대/절대 모두 시도
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [detail?.photo]);

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
            {/* 프로필(항상 표시) */}
            <div className="flex items-center gap-4">
              <ImageInputBox src={detail.pet?.photo} />
              <div className="flex-1">
                <h3 className="h3">{detail.pet?.name ?? '-'}</h3>
                <p className="h4 text-gray-500 mt-1">
                  {[species, ageText, subject].filter(Boolean).join(' / ')}
                </p>
              </div>
            </div>

            {/* 증상: 사진이 실제로 로드 가능할 때만 이미지 박스 렌더 */}
            <div>
              <h4 className="h4 mb-2">증상</h4>
              {symptomPhotoOk && <ImageInputBox src={detail.photo} />}
              <p className={`p whitespace-pre-wrap ${symptomPhotoOk ? 'mt-3' : ''}`}>
                {detail.description || '작성된 증상이 없습니다.'}
              </p>
            </div>
          </div>
        )}
      </ModalTemplate>
    </ModalOnLayout>
  );
};

export default VetReservationDetailModal;
