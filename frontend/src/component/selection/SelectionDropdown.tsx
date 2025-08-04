import React, { useState, useEffect } from 'react';
import DropdownArrow from '@/component/icon/Dropdown_Arrow';
import { useSubjectStore } from '@/store/SubjectStore';

interface DropdownProps {
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
}

export default function Dropdown({ options, placeholder = '' }: DropdownProps) {
  const setSubject = useSubjectStore((state) => state.setSubject);

  //  placeholder가 있으면 "", 없으면 첫 번째 옵션 value
  const [selectedValue, setSelectedValue] = useState(
    placeholder !== '' ? '' : options[0]?.value || '',
  );

  // options나 placeholder가 바뀔 때도 초기화
  useEffect(() => {
    setSelectedValue(placeholder !== '' ? '' : options[0]?.value || '');
  }, [options, placeholder]);

  // 선택값이 바뀔 때마다 store에 저장
  useEffect(() => {
    if (selectedValue) {
      setSubject(selectedValue);
    }
  }, [selectedValue, setSubject]);

  return (
    <div className="relative">
      <select
        value={selectedValue}
        onChange={(e) => setSelectedValue(e.target.value)}
        className="w-full border border-gray-400 h-12 appearance-none 
        focus:outline-none 
        hover:outline-none 
        bg-green-100 rounded-2xl px-4 py-2"
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
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
        <DropdownArrow width={24} height={24} />
      </span>
    </div>
  );
}
