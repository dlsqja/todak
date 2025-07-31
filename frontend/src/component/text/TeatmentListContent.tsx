import React from "react";

interface TreatmentListContentProps {
  time: string;
  department: string;
  petName: string;
  petInfo: string; // petType | age | department
  status: string;
}

const TreatmentListContent: React.FC<TreatmentListContentProps> = ({
  time,
  department,
  petName,
  petInfo,
  status,
}) => {
  return (
    <div
      style={{
        padding: "15px",
        backgroundColor: "#f0f0f0",
        borderRadius: "12px",
        display: "flex",
        flexDirection: "row", // 가로 배치
        gap: "15px",
        alignItems: "center",
      }}
    >
      {/* 왼쪽: 시간, 반려동물 이름, 나이, 진료과목 (세로 배치) */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", flex: 1 }}>
        <h4 style={{ fontWeight: "bold", margin: 0 }}>{time}</h4>
        <p style={{ fontSize: "14px", margin: "5px 0", fontWeight: "bold" }}>{petName}</p>
        <p style={{ fontSize: "12px", margin: "5px 0" }}>{petInfo}</p>
      </div>

      {/* 중간: 상태 표시 */}
      <div
        style={{
          backgroundColor: "#FFB800",
          color: "white",
          padding: "5px 10px",
          borderRadius: "20px",
          fontSize: "12px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {status}
      </div>

      {/* 오른쪽: 사진 (61.65px x 59.74px 크기) */}
      <div
        style={{
          width: "61.65px",
          height: "59.74px", // 설정된 크기로 수정
          backgroundColor: "#e0e0e0",
          borderRadius: "16px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img
          src="https://via.placeholder.com/40" // 예시 이미지 (실제 이미지 URL로 교체)
          alt="아이콘"
          style={{ width: "40px", height: "40px" }}
        />
      </div>
    </div>
  );
};

export default TreatmentListContent;
