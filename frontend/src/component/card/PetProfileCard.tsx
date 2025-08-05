import React from "react";

interface PetProfileCardProps {
  name: string;
  genderAge: string; // 예: "여 (중성)"
  breedAge: string; // 예: "비숑 9세"
  weight: string; // 예: "4.1kg"
  imageUrl?: string; // null이면 기본 Gray 원형
}

const PetProfileCard: React.FC<PetProfileCardProps> = ({
  name,
  genderAge,
  breedAge,
  weight,
  imageUrl,
}) => {
  return (
    <div className="w-full h-[140px] rounded-[16px] bg-white shadow-[0px_5px_15px_rgba(0,0,0,0.08)]  flex items-center px-5 py-5 gap-6">
      {/* 이미지 영역 */}
      <div className="w-[100px] h-[100px] rounded-full bg-green-200 overflow-hidden flex-shrink-0">
        {imageUrl && (
          <img
            src={imageUrl}
            alt="pet"
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* 텍스트 영역 */}
      <div className="flex flex-col justify-center flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <h3 className="h3 font-semibold text-black">{name}</h3>
          <p className="p text-black">{genderAge}</p>
        </div>
        <p className="p text-black mt-1">{breedAge}</p>
        <p className="p text-black mt-1">{weight}</p>
      </div>
    </div>
  );
};

export default PetProfileCard;
