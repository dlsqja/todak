import React, { useRef, useEffect, useState } from 'react';
import TreatmentSlideCard from '@/component/card/TreatmentSlideCard';

const cards = [
  { department: '안과', petName: '뽀삐', petInfo: '강아지 / 3세 / 여(중성화)', time: '17:00', is_signed: true },
  { department: '치과', petName: '쿠쿠', petInfo: '고양이 / 2세 / 남(중성화)', time: '18:00', is_signed: false },
  { department: '내과', petName: '초코', petInfo: '강아지 / 1세 / 여', time: '19:00', is_signed: false },
  { department: '외과', petName: '망고', petInfo: '고양이 / 4세 / 여', time: '20:00', is_signed: false },
];

const CARD_HEIGHT = 96;
const OVERLAP = 40;
const SNAP_GAP = CARD_HEIGHT - OVERLAP;

const MIN_CONTAINER_SCROLL_HEIGHT = 600; // 햄이 원하는 최소 스크롤 영역!

const TreatmentSlideList = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [focusedIndex, setFocusedIndex] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const index = Math.round(scrollTop / SNAP_GAP);
      setFocusedIndex(index);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  // 카드 스택 높이 계산
  const totalHeight = cards.length * SNAP_GAP + OVERLAP;
  const paddedHeight = Math.max(totalHeight, MIN_CONTAINER_SCROLL_HEIGHT);

  return (
    <div
      ref={containerRef}
      className="overflow-y-scroll hide-scrollbar"
      style={{
        height: '400px', // 고정된 화면 높이
        scrollSnapType: 'y mandatory',
      }}
    >
      <div
        className="relative"
        style={{
          height: `${paddedHeight}px`, // ✅ 무조건 스크롤되도록 보정
        }}
      >
        {cards.map((card, i) => {
          const top = i * SNAP_GAP;
          const isFocused = i === focusedIndex;

          return (
            <div
              key={i}
              className="absolute left-0 right-0 transition-transform duration-300 snap-start"
              style={{
                top,
                transform: isFocused ? 'scale(1)' : 'scale(0.96)',
                zIndex: isFocused ? 99 : cards.length - i,
              }}
            >
              <TreatmentSlideCard {...card} isAuthorized={true} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TreatmentSlideList;
