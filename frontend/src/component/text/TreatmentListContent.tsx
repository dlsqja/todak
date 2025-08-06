import React from "react";

interface TreatmentListContentProps {
  time: string;
  department: string;
  petName: string;
  petInfo: string; // petType | age | department
  status: string;
  image?: string; // 이미지 경로 (선택적)
}

const TreatmentListContent: React.FC<TreatmentListContentProps> = ({
  time,
  department,
  petName,
  petInfo,
  status,
  image,
}) => {
  return (
    <div className="p-4 rounded-lg flex gap-4 items-start">
      {/* 왼쪽: 시간, 반려동물 이름, 나이, 진료과목 (세로 배치) */}
      <div className="flex flex-col gap-1 flex-1"> {/* gap-2로 줄임 */}
        {/* 시간 */}
        <div className="time">
          <h4 className="h4 text-black">{time}</h4>
        </div>

        {/* 반려동물 이름 */}
        <div className="pet-name">
          <p className="p mt-1 text-black">{petName}</p> {/*mt-1로 줄임 */}
        </div>

        {/* 반려동물 정보 */}
        <div className="pet-info">
          <p className="caption mt-1 text-black">{petInfo}</p>
        </div>
      </div>

      {/* 중간: 상태 표시 */}
      <div
        className={`caption px-3 py-1 text-white rounded-full ${
          status === "대기중" ? "bg-yellow-400" : "bg-green-300"
        }`}
      >
        {status}
      </div>

      {/* 오른쪽: 이미지 (이미지박스) */}
      <div className="flex-shrink-0">
        <div className="w-[88px] h-[88px] bg-gray-300 rounded-lg flex justify-center items-center overflow-hidden">
          {image && <img src={image} alt="아이콘" className="w-full h-full object-cover" />}
        </div>
      </div>
    </div>
  );
};

export default TreatmentListContent;
