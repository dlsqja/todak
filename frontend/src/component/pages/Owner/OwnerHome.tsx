import React from 'react';
import { Outlet } from 'react-router-dom';
import '@/styles/main.css';
import OwnerTreatmentSimpleCard from "@/component/card/OwnerTreatmentSimpleCard";


export default function OwnerHome() {
  return (
    <div>
      <h1 className='h1'>Owner 홈</h1>
      <p>여기는 Owner 홈 화면입니다.</p>
      <Outlet />
      <OwnerTreatmentSimpleCard
      time="24:00-24:30"
      department="안과"
      petName="뽀삐"
      petInfo="강아지 / 3세 / 여(중성화)"
    />
    </div>
  );
}