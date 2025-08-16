import React, { useState } from 'react';
import DropdownArrow from '@/component/icon/Dropdown_Arrow';

interface OptionType {
  value: string;
  label: string;
  description?: string;
  photo?: string;
}

interface FilterDropdownProps {
  options: OptionType[]; // 배열 타입 명시
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  dropdownId: string; // 각 드롭다운을 구분할 수 있는 ID 추가
  activeDropdown: string | null; // 현재 활성화된 드롭다운 추적
  setActiveDropdown: (id: string | null) => void; // 활성화된 드롭다운 변경 함수
}

export default function SelectionDropdown({
  options = [], // options 기본값을 빈 배열로 설정
  placeholder = '전체',
  value,
  onChange,
  dropdownId,
  activeDropdown,
  setActiveDropdown,
}: FilterDropdownProps) {
  const [open, setOpen] = useState(false);

  // options가 배열인지 확인
  const validOptions = Array.isArray(options) ? options : [];

  const selectedOption = validOptions.find((opt) => opt.value === value);

  // 사진이나 설명이 있을 경우 true
  const hasDetail = selectedOption?.photo || selectedOption?.description;

  const toggleDropdown = () => {
  if (activeDropdown === dropdownId) {
    setOpen(!open); // 현재 열려 있는 드롭다운이면 토글
  } else {
    setActiveDropdown(dropdownId); // 다른 드롭다운을 클릭했을 때 열기
    setOpen(true); // 현재 드롭다운을 열기
  }
};

  // 드롭다운이 열릴 때, activeDropdown이 변경되면 자동으로 다른 드롭다운은 닫히게 됩니다
  return (
    <div className="relative w-full">
      {/* 선택된 항목 */}
      <button
        onClick={toggleDropdown}
        className={`
          w-full 
          ${hasDetail ? 'h-16' : 'h-12'} 
          rounded-2xl border border-gray-300 px-4 
          flex items-center justify-between bg-white
          focus:outline-none focus:ring-0 focus:border-green-300 focus:border-2
          transition-colors duration-200
          ${open ? 'border-green-300' : 'border-gray-300'}
        `}
      >
        <div className="flex items-center gap-3 text-left">
          {selectedOption?.photo && (
            <img
              src={selectedOption.photo}
              alt="profile"
              className="w-10 h-10 rounded-full object-cover"
            />
          )}
          <div className="flex flex-col">
            <p className="p">{selectedOption?.label ?? placeholder}</p>
            {selectedOption?.description && (
              <p className="caption text-gray-500">{selectedOption.description}</p>
            )}
          </div>
        </div>
        <span className="text-gray-400">
          <DropdownArrow width={24} height={24} stroke="currentColor" />
        </span>
      </button>

      {/* 옵션 리스트 */}
      {open && (
        <ul className="absolute z-10 mt-2 w-full bg-white border border-gray-300 rounded-2xl overflow-hidden shadow-lg">
          {validOptions.map((opt) => {
            const hasOptDetail = opt.photo || opt.description;
            return (
              <li
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                  setActiveDropdown(null); // 드롭다운 선택 후 닫기
                }}
                className={`
                  flex items-center gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer
                  ${!hasOptDetail ? 'h-12' : ''}
                `}
              >
                {opt.photo && (
                  <img
                    src={opt.photo}
                    alt="profile"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                )}
                <div className="flex flex-col">
                  <p className="p">{opt.label}</p>
                  {opt.description && (
                    <p className="caption text-gray-500">{opt.description}</p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
