// src/component/selection/TimeSelectionButton.tsx
// (기존 파일 교체)
// 현재 선택된 시간을 store에 저장하고 관리
import { useTimeStore } from '@/store/timeStore';

interface TimeSelectionButtonProps {
  start_time: string;           // "HH:mm"
  end_time: string;             // "HH:mm"
  /** workingHours - closingHours 로 계산된 실제 예약 가능 슬롯(HH:mm) */
  available_times?: string[];
}

const timeList = Array.from({ length: 48 }, (_, i) => {
  const hour = String(Math.floor(i / 2)).padStart(2, '0');
  const minute = i % 2 === 0 ? '00' : '30';
  return `${hour}:${minute}`;
});

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

export default function TimeSelection({
  start_time,
  end_time,
  available_times,
}: TimeSelectionButtonProps) {
  const selectedTime = useTimeStore((state) => state.selectedTime);
  const setSelectedTime = useTimeStore((state) => state.setSelectedTime);

  // 현재 시간
  const now = new Date();
  const nowTotal = now.getHours() * 60 + now.getMinutes();

  // 범위 계산
  const startTotal = toMinutes(start_time);
  const endTotal = toMinutes(end_time);

  // 시작 시간과 현재 시간 중 더 늦은 시간부터 end_time까지
  const validStart = Math.max(startTotal, nowTotal);

  // 1) 기본 필터: start~end, 현재 시각 이후
  const baseFiltered = timeList.filter((time) => {
    const total = toMinutes(time);
    return total >= validStart && total <= endTotal;
  });

  // 2) available_times가 넘어오면 교집합으로 추가 필터링(= closing 제거)
  const setAvail = new Set((available_times ?? []).map(String)); // 안전 변환
  const finalSlots =
    available_times && available_times.length > 0
      ? baseFiltered.filter((t) => setAvail.has(t))
      : baseFiltered;

  return (
    <div>
      <div
        className="flex gap-2 hide-scrollbar overflow-x-auto whitespace-nowrap py-2 focus:outline-none hover:outline-none"
      >
        {finalSlots.length === 0 ? (
          <div>선택 가능한 시간이 없습니다.</div>
        ) : (
          finalSlots.map((time) => (
            <button
              key={time}
              onClick={() => setSelectedTime(selectedTime === time ? '' : time)}
              className={`px-4 py-2 rounded-3xl ${
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
    </div>
  );
}
