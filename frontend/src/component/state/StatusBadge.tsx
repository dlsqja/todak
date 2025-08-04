import React from "react";

interface StatusBadgeProps {
  isActive: boolean;
  type: "treatment" | "payment" | "reservation" | "voice" | "기타추후추가"; // ✅ 테이블 구분
}

const statusConfig = {
  treatment: {
    true: {
      text: "서명 완료",
      className: "bg-green-300 text-green-100",
    },
    false: {
      text: "검토 대기",
      className: "bg-green-200 text-brown-300",
    },
  },
  payment: {
    true: {
      text: "결제 완료",
      className: "bg-green-300 text-green-100",
    },
    false: {
      text: "미결제",
      className: "bg-green-200 text-brown-300",
    },
  },
  reservation: {
    true: {
      text: "예약 확정",
      className: "bg-green-300 text-green-100",
    },
    false: {
      text: "예약 대기",
      className: "bg-green-200 text-brown-300",
    },
  },
  voice: {
    true: {
      text: "정책 적용",
      className: "bg-green-300 text-green-100",
    },
    false: {
      text: "정책 미적용",
      className: "bg-green-200 text-brown-300",
    },
  },
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ isActive, type }) => {
  const config = statusConfig[type][isActive ? "true" : "false"];

  return (
    <span className={`caption px-3 py-1 rounded-full ${config.className}`}>
      {config.text}
    </span>
  );
};

export default StatusBadge;