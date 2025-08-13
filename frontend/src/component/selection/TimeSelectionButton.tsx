// src/component/selection/TimeSelectionButton.tsx

import { useEffect, useMemo } from 'react'
import { useTimeStore } from '@/store/timeStore'

interface TimeSelectionButtonProps {
  start_time: string            // "HH:mm"
  end_time: string              // "HH:mm"
  /** workingHours - closingHours 로 계산된 실제 '선택 가능' 슬롯(HH:mm) */
  available_times?: string[]
  /** 닫힌 시간 등 '선택 불가'로 표시할 슬롯(HH:mm) — 옵션 */
  disabled_times?: string[]
}

const timeList = Array.from({ length: 48 }, (_, i) => {
  const hour = String(Math.floor(i / 2)).padStart(2, '0')
  const minute = i % 2 === 0 ? '00' : '30'
  return `${hour}:${minute}`
})

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

export default function TimeSelectionButton({
  start_time,
  end_time,
  available_times,
  disabled_times = [],
}: TimeSelectionButtonProps) {
  const selectedTime = useTimeStore((state) => state.selectedTime)
  const setSelectedTime = useTimeStore((state) => state.setSelectedTime)

  // 현재 시간
  const now = new Date()
  const nowTotal = now.getHours() * 60 + now.getMinutes()

  // 범위 계산
  const startTotal = toMinutes(start_time)
  const endTotal = toMinutes(end_time)

  // 시작 시간과 현재 시간 중 더 늦은 시간부터 end_time까지
  const validStart = Math.max(startTotal, nowTotal)

  // 1) 근무시간 범위 + 현재 이후만 우선 보여줄 전체 슬롯
  const fullRangeSlots = useMemo(() => {
    return timeList.filter((time) => {
      const total = toMinutes(time)
      return total >= validStart && total <= endTotal
    })
  }, [validStart, endTotal])

  // 2) 선택 가능/불가 판정
  const availableSet = useMemo(
    () => new Set((available_times ?? []).map(String)),
    [available_times]
  )
  const disabledSet = useMemo(
    () => new Set((disabled_times ?? []).map(String)),
    [disabled_times]
  )

  const isDisabled = (hhmm: string) => {
    // 명시적 비활성화 우선
    if (disabledSet.has(hhmm)) return true
    // available_times가 넘어오면 그 목록에 없는 것도 비활성화
    if (available_times && available_times.length > 0) {
      return !availableSet.has(hhmm)
    }
    return false
  }

  // 3) 선택된 값이 더 이상 선택 불가 상태가 되면 선택을 해제
  useEffect(() => {
    if (selectedTime && (isDisabled(selectedTime) || !fullRangeSlots.includes(selectedTime))) {
      setSelectedTime('')
    }
  }, [selectedTime, fullRangeSlots, setSelectedTime])

  return (
    <div>
      <div className="flex gap-2 hide-scrollbar overflow-x-auto whitespace-nowrap py-2 focus:outline-none hover:outline-none">
        {fullRangeSlots.length === 0 ? (
          <div>선택 가능한 시간이 없습니다.</div>
        ) : (
          fullRangeSlots.map((time) => {
            const disabled = isDisabled(time)
            const selected = selectedTime === time

            return (
              <button
                key={time}
                type="button"
                disabled={disabled}
                onClick={() => {
                  if (!disabled) setSelectedTime(selected ? '' : time)
                }}
                className={[
                  'px-4 py-2 rounded-3xl transition border',
                  disabled
                    ? 'opacity-50 cursor-not-allowed border-gray-500 bg-gray-300 text-gray-500'
                    : selected
                    ? 'bg-green-300 text-white border-green-300 h4'
                    : 'border-gray-500 text-black cursor-pointer p',
                ].join(' ')}
              >
                {time}
              </button>
            )
          })
        )}
      </div>
    </div>
  )
}
