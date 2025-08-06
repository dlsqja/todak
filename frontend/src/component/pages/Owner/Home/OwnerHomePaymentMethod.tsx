// src/component/pages/Owner/Home/OwnerHomePaymentMethod.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackHeader from '@/component/header/BackHeader';
import Button from '@/component/button/Button';

export default function PaymentMethodPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-green-100 flex flex-col">
      <BackHeader text="결제 수단 선택" />

      <div className="px-7 py-6 flex-1 overflow-y-auto flex flex-col gap-6">
      <p>결제 API 내용</p>
      </div>

      {/* 하단 버튼 */}
      <div className="px-6">
       <Button
        color="green"
        text="진료 신청하기"
        onClick={() => navigate('/owner/home/apply-complete')}
      />

      </div>
    </div>
  );
}
