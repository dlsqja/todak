import React, { useState } from 'react';
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
}

export default function FilterDropdown({
  options,
  placeholder = '전체',
  value,
  onChange,
}: FilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const selectedOption = options.find((opt) => opt.value === value);

  // ✅ 사진 or 설명이 있을 경우 true
  const hasDetail = selectedOption?.photo || selectedOption?.description;

  return (
    <div className="relative w-full">
      {/* 선택된 항목 */}
      <button
        onClick={() => setOpen(!open)}
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