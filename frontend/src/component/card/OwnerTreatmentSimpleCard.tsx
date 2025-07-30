import React from "react";

interface OwnerTreatmentSimpleCardProps {
  time: string;
  department: string;
  petName: string;
  petInfo: string; // 예: "강아지 / 3세 / 여(중성화)"
}

const OwnerTreatmentSimpleCard: React.FC<OwnerTreatmentSimpleCardProps> = ({
  time,
  department,
  petName,
  petInfo,
}) => {
  return (
    <div className="w-full max-w-[240px] p-4 bg-white rounded-[12px] shadow-card">
      <h4 className="text-lg font-semibold text-black">{time}</h4>
      <p className="mt-2 text-black">{department}</p>
      <p className="mt-1 text-black">{petName}</p>
      <p className="mt-1 text-black">{petInfo}</p>
    </div>
  );
};

export default OwnerTreatmentSimpleCard;
