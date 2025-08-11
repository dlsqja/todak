// 병원 관계자 병원관리 페이지 메인

import React, { useState } from 'react';
import '@/styles/main.css';
import { useNavigate } from 'react-router-dom';

import SimpleHeader from '@/component/header/SimpleHeader';
import Button from '@/component/button/Button';

export default function StaffHospitalHome() {
  const navigate = useNavigate();

  return (
    <div>
      <SimpleHeader text="병원 관리" />
      <div className="flex flex-col items-center justify-center min-h-screen space-y-8 pb-20">
        <div className="w-full max-w-sm">
          <Button text="병원 정보 관리" color="green" onClick={() => navigate('/staff/hospital/info')}
          />
        </div>
        <div className="w-full max-w-sm">
          <Button text="수의사 근무 시간관리" color="green" onClick={() => navigate('/staff/hospital/vet')}
          />
        </div>
      </div>
    </div>
  );
}
