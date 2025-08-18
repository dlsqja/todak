// src/component/pages/Owner/Home/OwnerHomeApplyComplete.tsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCheckCircle } from 'react-icons/fi';
import BackHeader from '@/component/header/BackHeader';
import Button from '@/component/button/Button';

export default function ApplyCompletePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <BackHeader text="비대면 진료" />

      <div className="flex-1 flex flex-col justify-center items-center px-7">
        <FiCheckCircle className="text-green-300 w-20 h-20 mb-6" />
        <p className="p text-center text-black">
          비대면 진료 신청이 완료되었습니다! <br />
          병원에서 신청을 검토할 때까지 기다려주세요!
        </p>
      </div>

      <div className="px-6 mb-8 flex flex-col gap-2">
        <Button
          color="lightgreen"
          text="진료 신청 내역 확인하기"
          onClick={() => navigate('/owner/reservation')}
        />
        <Button
          color="green"
          text="홈으로 돌아가기"
          onClick={() => navigate('/owner/home')}
        />
      </div>
    </div>
  );
}
