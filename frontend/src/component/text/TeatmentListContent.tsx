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
        flexDirection: "column",
        gap: "15px",
      }}
    >
      {/* time, status, image 가로 배치 */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h4 style={{ fontWeight: "bold", margin: 0 }}>{time}</h4>
        <div
          style={{
            backgroundColor: "#FFB800",
            color: "white",
            padding: "5px 10px",
            borderRadius: "20px",
            fontSize: "12px",
          }}
        >
          {status}
        </div>
        {/* 사진 */}
        <div
          style={{
            width: "62px",
            height: "62px",
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

      {/* 반려동물 이름과 정보 수직 배치 */}
      <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
        <p style={{ fontSize: "14px", margin: "5px 0", fontWeight: "bold" }}>
          {petName}
        </p>
        <p style={{ fontSize: "12px", margin: "5px 0" }}>{petInfo}</p>
      </div>
    </div>
  );
};

export default TreatmentListContent;
