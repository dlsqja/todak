import React from 'react';

interface StatusBadgeProps {
  type: 'treatment' | 'reservation' | 'payment';
  statusKey: string | number; // 0, 1, 2, "success", "fail" 등
}

const statusConfig = {
  treatment: {
    true: {
      text: '서명 완료',
      className: 'bg-green-300 text-green-100',
    },
    false: {
      text: '검토 대기',
      className: 'bg-green-200 text-brown-300',
    },
  },
  reservation: {
    0: {
      text: '대기',
      className: 'bg-green-200 text-brown-300',
    },
    1: {
      text: '승인',
      className: 'bg-green-300 text-green-100',
    },
    2: {
      text: '반려',
      className: 'bg-pink-200 text-green-100',
    },
  },
  payment: {
    true: {
      text: '결제 완료',
      className: 'bg-green-300 text-green-100',
    },
    false: {
      text: '미결제',
      className: 'bg-green-200 text-brown-300',
    },
  },
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ statusKey, type }) => {
  const config = statusConfig[type]?.[String(statusKey)] || {
    text: '알 수 없음',
    className: 'bg-gray-200 text-gray-600',
  };

  return <span className={`caption px-5 py-1 rounded-full ${config.className}`}>{config.text}</span>;
};

export default StatusBadge;
