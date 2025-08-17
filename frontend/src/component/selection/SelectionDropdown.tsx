import React, { useState, useEffect } from 'react'; // ★ useEffect 추가
import DropdownArrow from '@/component/icon/Dropdown_Arrow';

interface OptionType {
  value: string;
  label: string;
  description?: string;
  photo?: string;
}

interface FilterDropdownProps {
  options: OptionType[];
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  dropdownId: string;
  activeDropdown: string | null;
  setActiveDropdown: (id: string | null) => void;
}

export default function SelectionDropdown({
  options,
  placeholder = '전체',
  value,
  onChange,
  dropdownId,
  activeDropdown,
  setActiveDropdown,
}: FilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const selectedOption = options.find((opt) => opt.value === value);

  // 사진이나 설명이 있을 경우 true
  const hasDetail = selectedOption?.photo || selectedOption?.description;

  // ★ 다른 드롭다운이 활성화되면 이 드롭다운 자동 닫기
  useEffect(() => {
    if (activeDropdown !== dropdownId && open) {
      setOpen(false);
    }
  }, [activeDropdown, dropdownId, open]);

  const toggleDropdown = () => {
    if (activeDropdown === dropdownId) {
      // ★ 자기 자신을 닫을 때 전역도 null로 해제하여 일관성 유지
      if (open) {
        setOpen(false);
        setActiveDropdown(null);
      } else {
        setOpen(true);
      }
    } else {
      setActiveDropdown(dropdownId);
      setOpen(true);
    }
  };

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
          {options.map((opt) => {
            const hasOptDetail = opt.photo || opt.description;
            return (
              <li
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                  setActiveDropdown(null); // 선택 후 닫기(원래 있던 코드 유지)
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
