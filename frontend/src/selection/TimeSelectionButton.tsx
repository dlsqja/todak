// 현재 선택된 시간을 store에 저장하고 관리
import { useTimeStore } from '@/store/timeStore';

interface TimeSelectionProps {
  start_time: string;
  end_time: string;
}

const timeList = Array.from({ length: 48 }, (_, i) => {
  const hour = String(Math.floor(i / 2)).padStart(2, '0');
  const minute = i % 2 === 0 ? '00' : '30';
  return `${hour}:${minute}`;
});

export default function TimeSelection({ start_time, end_time }: TimeSelectionProps) {
  const selectedTime = useTimeStore((state) => state.selectedTime);
  const setSelectedTime = useTimeStore((state) => state.setSelectedTime);

  console.log('현재 store에 저장된 selectedTime:', selectedTime);

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
      <div
        className=" flex gap-2 
      hide-scrollbar 
      overflow-x-auto
       whitespace-nowrap 
       py-2 
       focus:outline-none 
       hover:outline-none"
      >
        {filteredTimeList.length === 0 ? (
          <div>선택 가능한 시간이 없습니다.</div>
        ) : (
          filteredTimeList.map((time) => (
            <button
              key={time}
              onClick={() => setSelectedTime(selectedTime === time ? '' : time)}
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
      {/* 현재 선택된 시간 확인용 - 지워도 됨 */}
      {/* <div>{selectedTime ? `선택된 시간: ${selectedTime}` : '시간을 선택하세요.'}</div> */}
    </div>
  );
}
