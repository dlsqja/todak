// src/pages/vet/VetHomeGuide.tsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import BackHeader from '@/component/header/BackHeader';
import Button from '@/component/button/Button';

export default function VetHomeGuide() {
  const navigate = useNavigate();

  return (
    <div className=" bg-green-100 pb-8">
      {/* 상단 고정 헤더 */}
      <BackHeader text="비대면 진료 가이드" />

      {/* 본문 */}
      <div className="px-7 pt-6 bg-green-100">
        {/* 안내 박스 */}
        <div className="bg-gray-100 rounded-xl p-5 mb-6">
          <p className="p text-black leading-relaxed text-center">
            「수의사법 시행령」에 따라
            <span className="h4 text-red-500"> 대면 진료 이력이 없는 </span>
            <br />
            <span className="h4"> 반려동물은 비대면 진료를 받을 수 없습니다.</span>
          </p>
        </div>
        <ul className="list-disc pl-5 mt-4 mb-45 p text-black space-y-1">
          <li>
            초진은 <span className="h4">반드시 병원에 방문</span>하여 대면 진료를 받아야 합니다.
          </li>
          <li>
            대면 진료를 받은 후, <span className="h4">같은 병원에서의 재진</span>은 비대면으로 받을 수 있어요.
          </li>
          <li>
            병원/수의사의 <span className="h4">판단에 따라 비대면 진료가 제한</span>될 수 있어요.
          </li>
        </ul>

        {/* 확인 버튼 */}
        <Button text="확인했어요" color="green" onClick={() => navigate('/vet/home')} />
      </div>
    </div>
  );
}
