import React from 'react';
import { FiChevronLeft } from 'react-icons/fi'; 

interface BackHeaderProps {
  text: string;
  onBack?: () => void; // 옵션: 기본은 window.history.back
}

const BackHeader: React.FC<BackHeaderProps> = ({ text, onBack }) => {
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      window.history.back(); // 기본 동작: 뒤로가기
    }
  };

  return (
    <div className="w-full h-12 bg-green-100 flex items-center justify-between px-4">
      <button
        onClick={handleBack}
        className="text-2xl text-black"
        aria-label="뒤로가기"
      >
        <FiChevronLeft />
      </button>
      <div className="absolute left-1/2 transform -translate-x-1/2 h4 text-black">
        {text}
      </div>
    </div>
  );
};

export default BackHeader;
