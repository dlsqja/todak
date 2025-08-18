import React from 'react';
import { FiChevronLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom'; // 추가

interface BackHeaderProps {
  text: string;
  onBack?: () => void; // 옵션: 기본은 router back
}

const BackHeader: React.FC<BackHeaderProps> = ({ text, onBack }) => {
  const navigate = useNavigate(); // 추가

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1); // React Router의 뒤로가기
    }
  };

  return (
    <div className="sticky top-0 z-50 w-full h-16 bg-gray-50 flex items-center justify-between px-4">
      <button onClick={handleBack} className="left-4 text-3xl text-black cursor-pointer" aria-label="뒤로가기">
        <FiChevronLeft />
      </button>
      <div className="absolute left-1/2 transform -translate-x-1/2 h3 text-black">{text}</div>
    </div>
  );
};

export default BackHeader;
