import React from 'react';
import { useNavigate } from 'react-router-dom';
import BackHeader from '@/component/header/BackHeader';
import Button from '@/component/button/Button';

export default function PaymentCancelPage() {
  const navigate = useNavigate();
  return (
    <div className="w-full h-full bg-gray-50 flex flex-col">
      <BackHeader text="결제수단 등록" />
      <div className="px-7 py-6 flex-1">
        <p className="text-red-600">사용자에 의해 인증이 취소되었습니다.</p>
      </div>
      <div className="pt-3">
        <Button color="green" text="다시 시도" onClick={() => navigate('/owner/home/payment')} />
      </div>
    </div>
  );
}
