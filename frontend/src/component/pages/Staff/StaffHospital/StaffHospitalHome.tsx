// 병원 관계자 병원관리 페이지 메인

import React, { useState } from 'react';
import '@/styles/main.css';

import SimpleHeader from '@/component/header/SimpleHeader';

export default function StaffHospital() {
  return (
    <div className="p-4 pt-4 pb-20 px-5 space-y-6">
      <SimpleHeader text="병원 관리" />
    </div>
  );
}
