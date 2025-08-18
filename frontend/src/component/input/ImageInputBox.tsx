import React, { useState } from 'react';

interface ImageBoxProps {
  src?: string; // 이미지 경로(필수)
  stroke?: string;
}

export default function ImageInputBox({ src, stroke = 'border-3 border-green-200' }: ImageBoxProps) {
  const [imageError, setImageError] = useState(false);
  const DEFAULT_IMAGE = '/images/pet_default.png';

  const handleImageError = () => {
    setImageError(true);
  };

  const displayImage = imageError || !src ? DEFAULT_IMAGE : src;

  return (
    <div
      className={`w-22 h-22 bg-green-100 border-3 border-gray-100 rounded-[16px] flex items-center justify-center overflow-hidden ${stroke}`}
    >
      <img src={displayImage} alt="기본 프로필" className="w-full h-full object-cover" onError={handleImageError} />
    </div>
  );
}
