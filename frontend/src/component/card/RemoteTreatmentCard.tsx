import React from "react";
import Button from "../button/Button";

interface RemoteTreatmentCardProps {
  petName: string;
  petInfo: string;
  department: string;
  symptom: string;
  time: string;
  onDetailClick?: () => void;
  onTreatClick?: () => void;
}

const RemoteTreatmentCard: React.FC<RemoteTreatmentCardProps> = ({
  petName,
  petInfo,
  department,
  symptom,
  time,
  // onDetailClick,
  // onTreatClick,
}) => {
  return (
    <div className="w-[336px] h-[224px] bg-white rounded-[12px] shadow-[0px_5px_15px_rgba(0,0,0,0.08)]  px-6 py-6 flex flex-col justify-between">
      {/* 상단: 이미지 + 이름/정보 + 시간/과 */}
      <div className="flex justify-between">
        <div className="flex gap-4 items-center">
          <div className="w-13 h-13 bg-green-200 rounded-md flex items-center justify-center">
            <span>📷</span>
          </div>
          <div className="flex flex-col">
            <h4 className="h4 text-black">{petName}</h4>
            <p className="p text-black">{petInfo}</p>
          </div>
        </div>
        <div className="text-right">
          <h4 className="h4 text-black">{time}</h4>
          <h4 className="h4 text-black">{department}</h4>
        </div>
      </div>

      {/* 중단: 증상 */}
      <div>
        <h4 className="h4 text-black font-bold">증상</h4>
        <p className="p text-black">{symptom}</p>
      </div>

      {/* 하단 버튼 */}
      <div className="flex gap-3">
        <Button
          text="상세 정보"
          color="lightgreen"
          className="flex-1"
        />
        <Button
          text="진료 받기"
          color="green"
          className="flex-1"
        />
      </div>
    </div>
  );
};

export default RemoteTreatmentCard;
