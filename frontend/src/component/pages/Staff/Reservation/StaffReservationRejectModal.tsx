import React, { useState } from 'react';
import ModalTemplate from '@/component/template/ModalTemplate';
import ImageInputBox from '@/component/input/ImageInputBox';
import SelectionDropdown from '@/component/selection/SelectionDropdown';
import Button from '@/component/button/Button';

interface Props {
  onClose: () => void;
  onSubmit: (reasonType: string, detail: string) => void;
  petName: string;
  petInfo: string;
  time: string;
  doctor: string;
  photo?: string;
}

const denialOptions = [
  { value: '초진', label: '초진' },
  { value: '예약 만석', label: '예약 만석' },
  { value: '기타', label: '기타' },
];

const StaffReservationRejectModal: React.FC<Props> = ({
  onClose,
  onSubmit,
  petName,
  petInfo,
  time,
  doctor,
  photo = '',
}) => {
  const [selectedReason, setSelectedReason] = useState('');
  const [detailReason, setDetailReason] = useState('');

  return (
    // ✅ 모달 포지션 고정 및 배경 오버레이 추가!!!
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="max-w-[340px] w-full">
        <ModalTemplate title="반려 사유 작성" onClose={onClose}>
          {/* 반려동물 정보 + 수의사 */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-3 items-center">
              <ImageInputBox src={photo} />
              <div>
                <h4 className="h4">{petName}</h4>
                <p className="p text-gray-500">{petInfo}</p>
              </div>
            </div>
            <div className="text-right">
              <h4 className="h4">{time}</h4>
              <p className="p text-gray-500">{doctor}</p>
            </div>
          </div>

          {/* 사유 선택 */}
          <div className="mb-4">
            <SelectionDropdown
              options={denialOptions}
              value={selectedReason}
              onChange={setSelectedReason}
              placeholder="사유 선택"
            />
          </div>

          {/* 상세 사유 작성 */}
          <textarea
            className="w-full h-24 p-3 rounded-2xl border border-gray-300 text-black p text-sm resize-none"
            placeholder="상세 사유를 작성해주세요"
            value={detailReason}
            onChange={(e) => setDetailReason(e.target.value)}
          />

          {/* 버튼 */}
          <div className="flex gap-3 mt-6">
            <Button text="취소" color="gray" onClick={onClose} />
            <Button
              text="작성 완료"
              color="green"
              onClick={() => onSubmit(selectedReason, detailReason)}
            />
          </div>
        </ModalTemplate>
      </div>
    </div>
  );
};

export default StaffReservationRejectModal;
