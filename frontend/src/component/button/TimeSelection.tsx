import React, { useState } from 'react';

interface TimeSelectionProps {
  time: string;
  nowHour: number;
  nowMinute: number;
  endTime: string;
}

const timeList = Array.from({ length: 48 }, (_, i) => {
  const hour = String(Math.floor(i / 2)).padStart(2, '0');
  const minute = i % 2 === 0 ? '00' : '30';
  return `${hour}:${minute}`;
});

// 예시: 백엔드에서 받아온 endtime 값
const endTime = '18:00';

function TimeSelection({ time, nowHour, nowMinute, endTime }: TimeSelectionProps) {
  const [hour, minute] = time.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);

  // 현재 시간보다 같거나 늦고, endtime보다 같거나 이르면 true
  const isAfterNow = hour > nowHour || (hour === nowHour && minute >= nowMinute);
  const isBeforeEnd = hour < endHour || (hour === endHour && minute <= endMinute);

  return isAfterNow && isBeforeEnd;
}

function TimeButtonSelection() {
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // 현재 시간 구하기
  const now = new Date();
  const nowHour = now.getHours();
  const nowMinute = now.getMinutes();

  // 현재 시간보다 늦은 시간만 필터링
  const filteredTimeList = timeList.filter((time) => {
    const [hour, minute] = time.split(':').map(Number);
    return hour > nowHour || (hour === nowHour && minute >= nowMinute); // 현재 시간과 같거나 늦은 시간만 필터링링
  });

  return (
    <div>
      <div className="flex gap-2 overflow-x-auto whitespace-nowrap py-2 hide-scrollba">
        {filteredTimeList.length === 0 ? (
          <div>선택 가능한 시간이 없습니다.</div> // 보여질 시간이 없는 경우 경고문문
        ) : (
          filteredTimeList.map((time) => (
            <button
              key={time}
              onClick={() => setSelectedTime(selectedTime === time ? null : time)}
              className={`px-4 py-2 rounded-3xl
                ${
                  selectedTime === time
                    ? 'bg-green-300 text-white h4'
                    : 'border border-gray-500 text-black cursor-pointer p-2 p'
                }`}
            >
              {time}
            </button>
          ))
        )}
      </div>
      <div>{selectedTime ? `선택된 시간: ${selectedTime}` : '시간을 선택하세요.'}</div>
    </div>
  );
}

export default TimeButtonSelection;
