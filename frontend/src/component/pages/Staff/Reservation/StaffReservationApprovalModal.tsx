import React from 'react';
import ModalTemplate from '@/component/template/ModalTemplate';
import Button from '@/component/button/Button';
interface ReservationApprovalModalProps {
  onClose: () => void;
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

const ReservationApprovalModal: React.FC<ReservationApprovalModalProps> = ({ onClose, data }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="max-w-[340px] w-full">
        <ModalTemplate title="예약 승인 완료" onClose={onClose}>
          {/* 정보 리스트 */}
          <div className="space-y-4 text-sm">
            <div>
              <p className="font-semibold">진료 시간</p>
              <p className="mt-1">{data.time}</p>
            </div>

            <div>
              <p className="font-semibold">수의사 및 진료 과목</p>
              <p className="mt-1">{data.doctor} | {data.department}</p>
            </div>

            <div>
              <p className="font-semibold">반려동물 정보</p>
              <p className="mt-1">{data.petName}</p>
              <p>{data.petAge} | {data.petType}</p>
            </div>

            <div>
              <p className="font-semibold">보호자 정보</p>
              <p className="mt-1">{data.ownerName}</p>
              <p>{data.ownerPhone}</p>
            </div>
          </div>

          {/* 확인 버튼 */}
          <div className="pt-6">
            <Button text='확인' color='green' onClick={onClose}/>
          </div>
        </ModalTemplate>
      </div>
    </div>
  );
};

export default ReservationApprovalModal;
