// src/component/selection/ClosingTimeSelectionButton.tsx

import React from 'react';

interface Props {
  vetId: string;
  startTime: string;
  endTime: string;
  disabledTimes: string[];
  setDisabledTimes: (times: string[]) => void;
}

const generateTimeSlots = (start: string, end: string): string[] => {
  const times: string[] = [];
  let [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);

  while (sh < eh || (sh === eh && sm < em)) {
    const formatted = `${String(sh).padStart(2, '0')}:${String(sm).padStart(2, '0')}`;
    times.push(formatted);
    sm += 30;
    if (sm >= 60) {
      sm = 0;
      sh += 1;
    }
  }

  return times;
};

export default function ClosingTimeSelectionButton({
  vetId,
  startTime,
  endTime,
  disabledTimes,
  setDisabledTimes,
}: Props) {
  const allTimes = generateTimeSlots(startTime, endTime);

  const toggleTime = (time: string) => {
    if (disabledTimes.includes(time)) {
      setDisabledTimes(disabledTimes.filter((t) => t !== time));
    } else {
      setDisabledTimes([...disabledTimes, time]);
    }
  };

  return (
    <div className="space-y-4">
      <h4 className="h4">예약 시간 설정</h4>

      <div className="flex flex-wrap gap-3">
        {allTimes.map((time) => {
          const isDisabled = disabledTimes.includes(time);
          return (
            <button
              key={time}
              type="button"
              onClick={() => toggleTime(time)}
              className={`w-[80px] py-2 rounded-full text-center border transition
                ${isDisabled ? 'bg-gray-300 text-gray-500 border-green-200' : 'bg-white text-black border-gray-300'}
              `}
            >
              {time}
            </button>
          );
        })}
      </div>
    </div>
  );
}
