// 병원 관계자 병원관리 - 병원 정보 관리

import React, { useState } from 'react';
import '@/styles/main.css';

import SimpleHeader from '@/component/header/SimpleHeader';

export default function StaffHospitalVet() {
  return (
    <div className="p-4 pt-4 pb-20 px-5 space-y-6">
      <SimpleHeader text="수의사 근무시간 관리" />
    </div>
  );
}
