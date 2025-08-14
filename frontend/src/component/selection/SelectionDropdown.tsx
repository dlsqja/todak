// src/component/selection/SelectionDropdown.tsx
import React, { useEffect, useRef } from 'react';
import DropdownArrow from '@/component/icon/Dropdown_Arrow';

interface DropdownProps {
  id?: string; // ✅ 각 드롭다운을 구분할 ID
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;

  // ✅ (선택) 상위에서 "현재 활성 드롭다운"을 제어하려면 이 두 개를 넘겨줘!
  activeId?: string | null;
  setActiveId?: (id: string | null) => void;

  // (선택) 클래스 커스텀용
  className?: string;
}

export default function SelectionDropdown({
  id,
  options,
  placeholder = '',
  value,
  onChange,
  activeId,
  setActiveId,
  className = '',
}: DropdownProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isControlled = typeof activeId !== 'undefined' && typeof setActiveId === 'function';
  const isActive = isControlled ? activeId === id : false;

  // 바깥 클릭 시 비활성 표시
  useEffect(() => {
    if (!isControlled) return;
    const onDown = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setActiveId!(null);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [isControlled, setActiveId]);

  return (
    <div
      ref={ref}
      className={`relative ${className}`}
      onMouseDown={() => isControlled && id && setActiveId!(id)} // 클릭 순간 활성 인식
      onFocusCapture={() => isControlled && id && setActiveId!(id)} // 키보드 포커스 활성 인식
    >
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => isControlled && activeId === id && setActiveId!(null)} // 포커스 빠지면 비활성
        className={`w-full border bg-white h-12 appearance-none rounded-2xl px-4 py-2
          focus:outline-none focus:ring-0
          ${isActive ? 'border-green-300 border-2' : 'border-gray-400'}
          ${value === '' ? 'text-gray-500' : 'text-black'}
        `}
        aria-expanded={isActive ? true : undefined}
      >
        {placeholder !== '' && (
          <option value="" disabled hidden className="text-gray-500">
            {placeholder}
          </option>
        )}
        {/* 선택 해제 옵션 */}
        <option value="" className="text-black">
          선택
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="text-black bg-white">
            {opt.label}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 z-5 text-gray-500">
        <DropdownArrow width={24} height={24} stroke="currentColor" />
      </span>
    </div>
  );
}
