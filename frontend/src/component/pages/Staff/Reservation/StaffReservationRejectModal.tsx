// src/component/pages/Staff/Reservation/StaffReservationRejectModal.tsx
import React, { useState } from 'react';
import ModalOnLayout from '@/layouts/ModalLayout';
import ImageInputBox from '@/component/input/ImageInputBox';
import Button from '@/component/button/Button';
import { speciesMapping } from '@/utils/speciesMapping'; // ✅ 종 라벨 매핑

interface Props {
  onClose: () => void;
  onSubmit: (reason: string) => void; // ✅ 입력 텍스트만 보냄
  petName: string;
  /** 기존 문자열 그대로도 OK */
  petInfo: string;
  /** (옵션) 원자료가 전달되면 모달에서 직접 라벨 조합 */
  species?: keyof typeof speciesMapping | string;
  age?: number;

  time: string;
  doctor: string;
  photo?: string;
}

const StaffReservationRejectModal: React.FC<Props> = ({
  onClose,
  onSubmit,
  petName,
  petInfo,
  species,
  age,
  time,
  doctor,
  photo = '',
}) => {
  const [detailReason, setDetailReason] = useState('');
  const [date, timeRange] = time.split(' ');

  // ✅ petInfo가 이미 오면 그대로 사용 / 없으면 species+age로 안전하게 조합
  const speciesLabel = species ? speciesMapping[species as keyof typeof speciesMapping] ?? String(species) : '';
  const ageLabel = typeof age === 'number' ? `${age}세` : '';
  const petInfoText =
    petInfo && petInfo.trim().length > 0 ? petInfo : [speciesLabel, ageLabel].filter(Boolean).join(' / ');

  const handleSubmit = () => {
    onSubmit(detailReason.trim());
  };
  return (
    <ModalOnLayout onClose={onClose}>
      <div className="mx-auto w-full">
        <div className="rounded-2xl bg-white shadow-[0px_12px_30px_rgba(0,0,0,0.15)] overflow-hidden">
          {/* 헤더 */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h3 className="h4">반려 사유 작성</h3>
            <button aria-label="닫기" onClick={onClose} className="p-2 -mr-2 rounded-full hover:bg-gray-100 transition">
              <span className="text-2xl leading-none">×</span>
            </button>
          </div>

          {/* 본문 */}
          <div className="p-5">
            {/* 반려동물 정보 + 수의사 */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex gap-3 items-center">
                <ImageInputBox src={photo} />
                <div>
                  <h4 className="h4">{petName}</h4>
                  <p className="p text-gray-500">{petInfoText || '-'}</p>
                </div>
              </div>
              <div className="text-right">
                <h4 className="h4">{date}</h4>
                <h4 className="h4">{timeRange}</h4>
                <p className="p text-gray-500">{doctor} 수의사</p>
              </div>
            </div>

            {/* 상세 사유 작성 (드롭다운 제거) */}
            <textarea
              className="w-full h-24 p-3 rounded-2xl border border-gray-300 text-black p text-sm resize-none"
              placeholder="상세 사유를 작성해주세요"
              value={detailReason}
              onChange={(e) => setDetailReason(e.target.value)}
            />

            {/* 버튼 */}
            <div className="flex gap-3 mt-6">
              <Button text="취소" color="lightgreen" onClick={onClose} />
              <Button text="작성 완료" color="green" onClick={handleSubmit} />
            </div>
          </div>
        </div>
      </div>
    </ModalOnLayout>
  );
};

export default StaffReservationRejectModal;
