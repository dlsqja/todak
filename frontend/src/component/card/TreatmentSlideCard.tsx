import React from "react";
import StatusBadge from "@/component/state/StatusBadge";

interface TreatmentSlideCardProps {
  department: string;
  petName: string;
  petInfo: string;
  time: string;
  isAuthorized: boolean;
  is_signed: boolean;
}

const TreatmentSlideCard: React.FC<TreatmentSlideCardProps> = ({
  department,
  petName,
  petInfo,
  time,
  isAuthorized,
  is_signed
}) => {
  return (
    <div className="w-[340px] h-[96px] shrink-0 bg-white rounded-[12px] shadow-[0px_5px_15px_rgba(0,0,0,0.08)] p-4 overflow-hidden">
      <div className="flex flex-col justify-between h-full">
        {/* 상단: 진료과 / 시간 */}
        <div className="flex justify-between items-start">
          <h4 className="h4 text-black">{department}</h4>
          <h4 className="h4 text-black">{time}</h4>
        </div>

        {/* 중간: 반려동물 이름 */}
        <p className="p text-black">{petName}</p>

        {/* 하단: 반려동물 정보 + 상태 뱃지 */}
        <div className="flex justify-between items-end">
          <p className="caption text-black leading-none">{petInfo}</p>
          <div className="flex-shrink-0 leading-none translate-y-[-4px]">
            <StatusBadge type="treatment" statusKey={is_signed}/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TreatmentSlideCard;
