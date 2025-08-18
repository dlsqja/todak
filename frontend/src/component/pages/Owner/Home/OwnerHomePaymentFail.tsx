import React from 'react';
import { useNavigate } from 'react-router-dom';
import BackHeader from '@/component/header/BackHeader';
import Button from '@/component/button/Button';

export default function PaymentFailPage() {
  const navigate = useNavigate();
  return (
    <div className="w-full h-full bg-gray-50 flex flex-col">
      <BackHeader text="결제수단 등록" />
      <div className="px-7 py-6 flex-1">
        <p className="text-red-600">인증 처리에 실패했습니다. 잠시 후 다시 시도해주세요.</p>
      </div>
      <div className="pt-3">
        <Button color="green" text="다시 시도" onClick={() => navigate('/owner/home/payment')} />
      </div>
    </div>
  );
}
