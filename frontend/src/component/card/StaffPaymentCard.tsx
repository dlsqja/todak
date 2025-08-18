import React from 'react';
import StatusBadge from '@/component/state/StatusBadge';

interface StaffPaymentCardProps {
  /** 수의사 이름(우선 표기) */
  vetName?: string;
  /** 과(백업 표기) */
  department?: string;

  petName: string;
  petInfo: string;   // "종 | 나이세 | 과"
  time: string;      // "HH:mm ~ HH:mm" 또는 "09:00"
  isPaid: boolean;   // 결제 여부
  onClick?: () => void;
}

/** 결제관리 전용 카드: 왼쪽 상단은 수의사 이름(없으면 과목) */
const StaffPaymentCard: React.FC<StaffPaymentCardProps> = ({
  vetName,
  department,
  petName,
  petInfo,
  time,
  isPaid,
  onClick,
}) => {
  // 표시 라벨: vetName 우선, 없으면 department, 그것도 없으면 '진료'
  const leftLabel = (vetName && vetName.trim()) || department || '진료';

  return (
    <div
      className="w-full h-[96px] shrink-0 bg-white rounded-[12px] shadow-[0px_5px_15px_rgba(0,0,0,0.08)] p-4 overflow-hidden"
      onClick={onClick}
    >
      <div className="flex flex-col justify-between h-full">
        {/* 상단: 수의사 이름(또는 과) / 시간 */}
        <div className="flex justify-between items-start">
          <h4 className="h4 text-black">{leftLabel}</h4>
          <h4 className="h4 text-black">{time}</h4>
        </div>

        {/* 중간: 반려동물 이름 */}
        <p className="p text-black">{petName}</p>

        {/* 하단: 반려동물 정보 + 상태 뱃지(결제) */}
        <div className="flex justify-between items-end">
          <p className="caption text-black leading-none">{petInfo}</p>
          <div className="flex-shrink-0 leading-none translate-y-[-4px]">
            <StatusBadge type="payment" statusKey={isPaid ? 'true' : 'false'} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffPaymentCard;

