// src/component/selection/TimeSelectionDropdown.tsx
import React from 'react';
import { useTimeStore } from '@/store/timeStore';
import DropdownArrow from '@/component/icon/Dropdown_Arrow';

interface TimeSelectionDropdownProps {
  start_time: string;
  end_time: string;
  label: string;
  /** 이 컴포넌트 외부에서 비활성화 제어 */
  disabled?: boolean;
}

const timeList = Array.from({ length: 48 }, (_, i) => {
  const hour = String(Math.floor(i / 2)).padStart(2, '0');
  const minute = i % 2 === 0 ? '00' : '30';
  return `${hour}:${minute}`;
});

export default function TimeSelectionDropdown({
  start_time,
  end_time,
  label,
  disabled = false, // ✅ 기본은 활성, 필요 페이지에서만 비활성화
}: TimeSelectionDropdownProps) {
  const selectedTime = useTimeStore((state) => state.selectedTime);
  const setSelectedTime = useTimeStore((state) => state.setSelectedTime);

  // 현재 시간
  const now = new Date();
  const nowTotal = now.getHours() * 60 + now.getMinutes();

  // 범위 계산
  const [startHour, startMinute] = start_time.split(':').map(Number);
  const [endHour, endMinute] = end_time.split(':').map(Number);
  const startTotal = startHour * 60 + startMinute;
  const endTotal = endHour * 60 + endMinute;

  // 시작 시간과 현재 시간 중 더 늦은 시간부터 end_time까지
  const validStart = Math.max(startTotal, nowTotal);

  const filteredTimeList = timeList.filter((time) => {
    const [hour, minute] = time.split(':').map(Number);
    const total = hour * 60 + minute;
    return total >= validStart && total <= endTotal;
  });

  return (
    <div>
      <label className="block mb-2 text-black h4">{label}</label>
      <div className="relative">
        <select
          disabled={disabled} // ✅ 비활성화
          className={[
            'appearance-none w-full h-12 rounded-2xl px-4 py-2',
            'border border-gray-400',
            'focus:outline-none focus:ring-0 focus:border-green-300 focus:border-2',
            'hover:outline-none',
            disabled
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed' // ✅ 비활성화 스타일
              : 'bg-white',
          ].join(' ')}
          value={selectedTime}
          onChange={disabled ? undefined : (e) => setSelectedTime(e.target.value)} // ✅ 막기
        >
          {filteredTimeList.map((time) => (
            <option className="text-black bg-white p" key={time} value={time}>
              {time}
            </option>
          ))}
        </select>

        <span
          className={[
            'pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 z-10 text-gray-500',
            disabled ? 'opacity-50' : '',
          ].join(' ')}
        >
          <DropdownArrow width={24} height={24} stroke="currentColor" />
        </span>
      </div>
    </div>
  );
}
