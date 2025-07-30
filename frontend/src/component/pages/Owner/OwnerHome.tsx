import React from 'react';
import { Outlet } from 'react-router-dom';
import '@/styles/main.css';

export default function OwnerHome() {
  return (
    <div>
      <h1 className='h1'>Owner 홈</h1>
      <p>여기는 Owner 홈 화면입니다.</p>
      <Outlet />
    </div>
  );
}