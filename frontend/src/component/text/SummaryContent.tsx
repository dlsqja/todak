import React from "react";

interface SummaryContentProps {
  title: string;
  content: string;
}

const SummaryContent: React.FC<SummaryContentProps> = ({ title, content }) => {
  return (
    <div style={{ padding: "10px", borderRadius: "8px" }}>
      <h2 style={{ fontWeight: "bold", marginBottom: "15px" }}>{title}</h2>

      {/* 내용이 하얀색 박스 안에 들어가도록 설정 */}
      <div
        style={{
          backgroundColor: "#ffffff",  // 하얀색 배경
          padding: "15px",  // 내용과 박스 간의 간격
          borderRadius: "8px",  // 둥근 모서리
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // 약간의 그림자
        }}
      >
        <p>{content}</p>
      </div>
    </div>
  );
};

export default SummaryContent;
