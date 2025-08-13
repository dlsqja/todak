// src/component/pages/Staff/Reservation/StaffReservationApprovalModal.tsx
import React from 'react';
import ModalOnLayout from '@/layouts/ModalLayout';
import Button from '@/component/button/Button';

interface ReservationApprovalModalProps {
  onClose: () => void;
  onConfirm?: () => void; // 승인 콜백
  data: {
    time: string;
    doctor: string;
    department: string;
    petName: string;
    petAge: string;
    petType: string;
    ownerName: string;
    ownerPhone: string;
  };
}

const ReservationApprovalModal: React.FC<ReservationApprovalModalProps> = ({
  onClose,
  onConfirm,
  data,
}) => {
  // 안전 래퍼: 취소는 절대 승인 안 타게!
  const handleCancelClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onClose();
  };

  const handleApproveClick: React.MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onConfirm) await onConfirm();
    else onClose();
  };

  return (
    <ModalOnLayout onClose={onClose}>
      <div className="mx-auto w-full">
        <div className="rounded-2xl bg-white shadow-[0px_12px_30px_rgba(0,0,0,0.15)] overflow-hidden">
          {/* 헤더 */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h3 className="h4">예약 승인</h3>
            <button
              aria-label="닫기"
              onClick={handleCancelClick}
              className="p-2 -mr-2 rounded-full hover:bg-gray-100 transition"
              type="button"
            >
              <span className="text-2xl leading-none">×</span>
            </button>
          </div>

          {/* 본문 */}
          <div className="p-5">
            <div className="space-y-4 text-sm">
              <div>
                <p className="font-semibold">진료 시간</p>
                <p className="mt-1">{data.time}</p>
              </div>

              <div>
                <p className="font-semibold">수의사 및 진료 과목</p>
                <p className="mt-1">
                  {data.doctor} | {data.department}
                </p>
              </div>

              <div>
                <p className="font-semibold">반려동물 정보</p>
                <p className="mt-1">{data.petName}</p>
                <p>
                  {data.petAge} | {data.petType}
                </p>
              </div>

              <div>
                <p className="font-semibold">보호자 정보</p>
                <p className="mt-1">{data.ownerName}</p>
                <p>{data.ownerPhone}</p>
              </div>
            </div>

            {/* 하단 버튼 */}
            <div className="pt-6 grid grid-cols-2 gap-3">
              {/* ❌ 취소: 모달만 닫기 */}
              <Button color="lightgreen" text="취소" onClick={handleCancelClick} />
              {/* ✅ 승인: onConfirm 있을 때만 승인, 없으면 닫기 */}
              <Button color="green" text="승인" onClick={handleApproveClick} />
            </div>
          </div>
        </div>
      </div>
    </ModalOnLayout>
  );
};

export default ReservationApprovalModal;
