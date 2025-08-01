import React from "react";
import { FiX } from "react-icons/fi";

interface ModalTemplateProps {
  title?: string;
  onClose?: () => void;
  children: React.ReactNode;
}

const ModalTemplate: React.FC<ModalTemplateProps> = ({ title, onClose, children }) => {
  return (
    <div className="bg-white rounded-[12px] px-6 py-6 w-[320px] shadow-[0px_5px_15px_rgba(0,0,0,0.08)] relative">
      {/* 상단 제목 및 닫기 아이콘 */}
      {(title || onClose) && (
        <div className="flex items-center justify-between mb-4">
          {title ? <h4 className="h4">{title}</h4> : <div />}
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 text-xl text-gray-500 hover:text-black transition-colors"
            >
              <FiX size={20} />
            </button>
          )}
        </div>
      )}

      {/* 본문 삽입 영역 */}
      <div>{children}</div>
    </div>
  );
};

export default ModalTemplate;
