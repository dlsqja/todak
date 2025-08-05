import React from "react";

interface ImageContentProps {
  title: string;
  image?: string;  // image를 props로 받도록 수정
}

const ImageContent: React.FC<ImageContentProps> = ({ title, image }) => {
  // 하드 코딩된 contents 데이터
  const contents = [
    "이름: 뽀삐",
    "나이: 3세",
    "동물 종류: 고양이",
  ];

  return (
    <div className="p-4 rounded-lg">
      <h2 className="font-bold mb-4">{title}</h2>

      {/* 이미지 네모 박스만 표시 */}
      <div className="flex-shrink-0">
        <div className="w-[88px] h-[88px] bg-gray-300 rounded-lg flex justify-center items-center overflow-hidden">
          {/* 조건부 렌더링: image가 있으면 이미지를, 없으면 빈 박스를 표시 */}
          {image && <img src={image} alt="아이콘" className="w-full h-full object-cover" />}
        </div>
      </div>

      <ul className="mt-4">
        {contents.map((content, index) => (
          <li key={index} className="mb-2">
            {content}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ImageContent;
