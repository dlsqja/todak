// ex)증상 - 사진 - 설명

import React from "react";

interface ImageContentProps {
  title: string;
}

const ImageContent: React.FC<ImageContentProps> = ({ title }) => {
  // 하드 코딩된 contents 데이터
  const contents = [
    "이름: 뽀삐",
    "나이: 3세",
    "동물 종류: 고양이",
  ];

  return (
    <div style={{ padding: "10px", borderRadius: "8px" }}>
      <h2 style={{ fontWeight: "bold", marginBottom: "15px" }}>{title}</h2>

      {/* 이미지 네모 박스만 표시 */}
      <div
        style={{
          width: "90px",   // 네모박스의 크기 설정
          height: "90px",  // 네모박스의 크기 설정
          backgroundColor: "#E9F1D7", // 네모 박스의 배경색
          borderRadius: "16px", // 둥근 모서리 설정
        }}
      >
        {/* 이곳에 나중에 이미지를 추가할 예정 */}
      </div>

      <ul>
        {contents.map((content, index) => (
          <li key={index} style={{ marginBottom: "5px" }}>
            {content}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ImageContent;

