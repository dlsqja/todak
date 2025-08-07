// src/pages/owner/OwnerHomeGuide.tsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import BackHeader from '@/component/header/BackHeader';
import Button from '@/component/button/Button';

export default function OwnerHomeGuide() {
  const navigate = useNavigate();

  return (
    <div className=" bg-green-100 pb-8">
      {/* 상단 고정 헤더 */}
      <BackHeader text="비대면 진료 가이드" />

      {/* 본문 */}
      <div className="px-7 pt-6 bg-green-100">
        {/* 안내 박스 */}
        <div className="bg-gray-100 rounded-xl p-5 mb-6">
          <p className="p text-black leading-relaxed">
            「수의사법 시행령」에 따라
            <span className="h4 text-red-500"> 대면 진료 이력이 없는 반려동물</span>은 
            <span className="h4"> 비대면 진료를 받을 수 없습니다.</span>
          </p>

          <ul className="list-disc pl-5 mt-4 tp text-gray-700 space-y-1">
            <li>초진은 반드시 병원에 방문하여 대면 진료를 받아야 합니다.</li>
            <li>대면 진료를 받은 후, 같은 병원에서의 재진은 비대면으로 받을 수 있어요.</li>
            <li>병원/수의사의 판단에 따라 비대면 진료가 제한될 수 있어요.</li>
          </ul>
        </div>

        {/* 확인 버튼 */}
        <Button text="확인했어요" color="green" onClick={() => navigate('/owner/home')} />
      </div>
    </div>
  );
}
