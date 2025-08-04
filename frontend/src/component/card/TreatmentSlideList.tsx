import React from "react";
import TreatmentSlideCard from "@/component/card/TreatmentSlideCard";

const TreatmentSlideList = () => {
  const items = [
  {
    department: "안과",
    petName: "뽀삐",
    petInfo: "강아지 / 3세 / 여(중성화)",
    time: "17:00",
    is_signed: true, // ✅ 추가
    isAuthorized: true,
  },
  {
    department: "치과",
    petName: "쿠쿠",
    petInfo: "고양이 / 2세 / 남(중성화)",
    time: "18:00",
    is_signed: false, // ✅ 추가
    isAuthorized: true,
  },
  {
    department: "내과",
    petName: "초코",
    petInfo: "강아지 / 1세 / 여",
    time: "19:00",
    is_signed: false, // ✅ 추가
    isAuthorized: false,
  },
];


  return (
    <div className="w-full overflow-x-auto overflow-y-hidden">
      <div className="flex gap-4 px-4 py-2">
        {items.map((item, idx) => (
          <TreatmentSlideCard key={idx} {...item} />
        ))}
      </div>
    </div>
  );
};

export default TreatmentSlideList;
