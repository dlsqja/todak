import React, { useState, useEffect } from 'react';
import DropdownArrow from '@/component/icon/Dropdown_Arrow';
import { useSubjectStore } from '@/store/SubjectStore';

// 수정된 Dropdown.tsx
interface DropdownProps {
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
}

export default function SelectionDropdown({ options, placeholder = '', value, onChange }: DropdownProps) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-green-300 h-12 appearance-none rounded-2xl px-4 py-2"
      >
        {placeholder !== '' && (
          <option value="" disabled hidden>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 z-10 text-gray-500">
        <DropdownArrow width={24} height={24} stroke="currentColor" />
      </span>
    </div>
  );
}
