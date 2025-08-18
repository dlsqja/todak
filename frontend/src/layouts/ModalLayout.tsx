import React, { useLayoutEffect, useState } from 'react';

function ModalOnLayout({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose?: () => void;
}) {
  const [rect, setRect] = useState<{ left: number; width: number } | null>(null);

  useLayoutEffect(() => {
    const el = document.getElementById('app-shell');
    const update = () => {
      if (!el) return setRect(null);
      const r = el.getBoundingClientRect();
      setRect({ left: r.left, width: r.width });
    };
    update();
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, { passive: true });
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Dim */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* 패널: 레이아웃 좌표/폭에 맞추고 세로 중앙 정렬 */}
      <div
        className="absolute"
        style={{
          left: rect ? `${rect.left}px` : '0px',
          width: rect ? `${rect.width}px` : '100vw',
          top: '50%',
          transform: 'translateY(-50%)',
        }}
      >
        {/* 페이지와 동일한 좌우 여백(px-7) + 안전한 최대 높이 */}
        <div className="px-7">
          <div className="max-h-[85vh] overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalOnLayout;
