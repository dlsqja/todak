import React from "react";

interface TreatmentSlideCardProps {
  department: string;
  petName: string;
  petInfo: string;
  time: string;
  isAuthorized: boolean; // ✅ 수정: 상태값 boolean 으로 받음
}

const getStatusStyle = (isAuthorized: boolean) => {
  return isAuthorized
    ? "bg-green-300 text-green-100"
    : "bg-green-200 text-brown-300";
};

const getStatusText = (isAuthorized: boolean) => {
  return isAuthorized ? "서명 완료" : "검토 대기";
};

const TreatmentSlideCard: React.FC<TreatmentSlideCardProps> = ({
  department,
  petName,
  petInfo,
  time,
  isAuthorized,
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
        <div className="flex justify-between items-baseline">
          <p className="caption text-black">{petInfo}</p>
          <span
            className={`caption px-3 py-1 rounded-full ${getStatusStyle(isAuthorized)}`}
          >
            {getStatusText(isAuthorized)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TreatmentSlideCard;
