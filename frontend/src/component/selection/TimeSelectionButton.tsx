// src/component/selection/TimeSelectionButton.tsx
import { useEffect, useMemo, useRef, useState } from 'react'
import { useTimeStore } from '@/store/timeStore'

interface TimeSelectionButtonProps {
  start_time: string            // "HH:mm"
  end_time: string              // "HH:mm"
  available_times?: string[]    // workingHours - closingHours 로 계산된 실제 '선택 가능' 슬롯(HH:mm)
  disabled_times?: string[]     // 닫힌 시간 등 '선택 불가' 슬롯(HH:mm)
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

  // =========================
  // 🖱️ 마우스 드래그 가로 스크롤
  // =========================
  const containerRef = useRef<HTMLDivElement>(null)
  const isDownRef = useRef(false)
  const movedRef = useRef(false)                 // 클릭과 드래그 구분
  const startXRef = useRef(0)
  const startScrollLeftRef = useRef(0)
  const [dragging, setDragging] = useState(false)
  const DRAG_THRESHOLD = 5

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    let pointerId: number | null = null

    const onPointerDown = (e: PointerEvent) => {
      isDownRef.current = true
      movedRef.current = false
      startXRef.current = e.clientX
      startScrollLeftRef.current = el.scrollLeft
      setDragging(true)
      pointerId = e.pointerId
    }

    const onPointerMove = (e: PointerEvent) => {
      if (!isDownRef.current) return
      const dx = e.clientX - startXRef.current
      if (!movedRef.current && Math.abs(dx) > DRAG_THRESHOLD) {
        movedRef.current = true
        if (pointerId != null) el.setPointerCapture?.(pointerId)
      }
      if (movedRef.current) {
        el.scrollLeft = startScrollLeftRef.current - dx
        e.preventDefault() // 텍스트 선택 방지
      }
    }

    const endDrag = () => {
      if (!isDownRef.current) return
      isDownRef.current = false
      setDragging(false)
      if (pointerId != null) el.releasePointerCapture?.(pointerId)
      pointerId = null
      setTimeout(() => { movedRef.current = false }, 0)
    }

    el.addEventListener('pointerdown', onPointerDown, { passive: true })
    el.addEventListener('pointermove', onPointerMove)
    el.addEventListener('pointerup', endDrag)
    el.addEventListener('pointerleave', endDrag)
    el.addEventListener('pointercancel', endDrag)

    return () => {
      el.removeEventListener('pointerdown', onPointerDown)
      el.removeEventListener('pointermove', onPointerMove)
      el.removeEventListener('pointerup', endDrag)
      el.removeEventListener('pointerleave', endDrag)
      el.removeEventListener('pointercancel', endDrag)
    }
  }, [])
  // =========================

  // 현재 시간
  const now = new Date()
  const nowTotal = now.getHours() * 60 + now.getMinutes()

  // 범위 계산
  const startTotal = toMinutes(start_time)
  const endTotal = toMinutes(end_time)

  // 시작 시간과 현재 시간 중 더 늦은 시간부터 end_time까지
  const validStart = Math.max(startTotal, nowTotal)

  // 1) 근무시간 범위 + 현재 이후만 우선 보여줄 전체 슬롯
  //    👉 근무 종료시는 "미포함"이므로 '< endTotal' 로 필터링!
  const fullRangeSlots = useMemo(() => {
    return timeList.filter((time) => {
      const total = toMinutes(time)
      return total >= validStart && total < endTotal   // ★ end 미포함
    })
  }, [validStart, endTotal])

  // 2) 선택 가능/불가 판정 (closing-hours 반영)
  const availableSet = useMemo(
    () => new Set((available_times ?? []).map(String)),
    [available_times]
  )
  const disabledSet = useMemo(
    () => new Set((disabled_times ?? []).map(String)),
    [disabled_times]
  )

  const isDisabled = (hhmm: string) => {
    if (disabledSet.has(hhmm)) return true
    if (available_times && available_times.length > 0) {
      // workingHours에서 closing-hours 뺀 결과만 선택 가능
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

  // 클릭 핸들러(드래그 후 오작동 방지)
  const handleTimeClick = (time: string, disabled: boolean, selected: boolean) => {
    if (movedRef.current) return // 드래그였다면 클릭 무시
    if (!disabled) setSelectedTime(selected ? '' : time)
  }

  return (
    <div>
      <div
        ref={containerRef}
        className={[
          'flex gap-2 hide-scrollbar overflow-x-auto whitespace-nowrap py-2 focus:outline-none hover:outline-none',
          dragging ? 'cursor-grabbing select-none' : 'cursor-grab'
        ].join(' ')}
      >
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
                onClick={() => handleTimeClick(time, disabled, selected)}
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
