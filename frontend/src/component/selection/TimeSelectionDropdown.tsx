import React from 'react';
import { useTimeStore } from '../../store/timeStore';
import DropdownArrow from '@/component/icon/Dropdown_Arrow';

interface TimeSelectionDropdownProps {
  start_time: string;
  end_time: string;
  label: string;
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
}: TimeSelectionDropdownProps) {
  const selectedTime = useTimeStore((state) => state.selectedTime);
  const setSelectedTime = useTimeStore((state) => state.setSelectedTime);

  // 현재 시간 구하기
  const now = new Date();
  const nowHour = now.getHours();
  const nowMinute = now.getMinutes();
  const nowTotal = nowHour * 60 + nowMinute;

  // start_time, end_time을 분 단위로 변환
  const [startHour, startMinute] = start_time.split(':').map(Number);
  const [endHour, endMinute] = end_time.split(':').map(Number);
  const startTotal = startHour * 60 + startMinute;
  const endTotal = endHour * 60 + endMinute;

  // 시작 시간과 현재 시간 중 더 늦은 시간부터 end_time까지 필터링
  let validStart: number;
  if (startTotal <= nowTotal) {
    validStart = nowTotal;
  } else {
    validStart = startTotal;
  }

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
          className="appearance-none 
        w-full border 
        border-gray-400 h-12 
        focus:outline-none
        hover:outline-none
        bg-green-100 
        rounded-2xl 
        px-4 py-2"
          value={selectedTime}
          onChange={(e) => setSelectedTime(e.target.value)}
        >
          {filteredTimeList.map((time) => (
            <option className="text-black bg-white h4" key={time} value={time}>
              {time}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
          <DropdownArrow width={24} height={24} />
        </span>
        {/* 현재 선택된 시간 확인용 - 지워도 됨 */}
        {/* {selectedTime ? `선택된 시간: ${selectedTime}` : '시간을 선택하세요.'} */}
      </div>
    </div>
  );
}
