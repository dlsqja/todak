// 병원 관계자 병원관리 - 수의사 근무시간 관리

import React, { useState } from 'react';
import '@/styles/main.css';

import BackHeader from '@/component/header/BackHeader';
import TimeSelectionDropdown from '@/component/selection/TimeSelectionDropdown';
import Button from '@/component/button/Button';

const days = ['월', '화', '수', '목', '금', '토', '일'];

export default function StaffHospitalVet() {
  const [vet, setVet] = useState('수의사 이름 1');

  return (
    <>
      <BackHeader text="수의사 기본 근무 시간" />

      <div className="px-5 pb-24 pt-4 space-y-6">
        {/* 수의사 선택 */}
        <div className="bg-gray-100 p-4 rounded-2xl">
          <label className="block mb-2 h4 text-black">수의사 선택</label>
          <select
            className="w-full h-12 border border-gray-400 rounded-xl px-4 text-black"
            value={vet}
            onChange={(e) => setVet(e.target.value)}
          >
            <option>수의사 이름 1</option>
            <option>수의사 이름 2</option>
          </select>
          <p className="text-gray-500 mt-2 caption">근무시간 미정</p>
        </div>

        {/* 전체 설정 */}
        <div className="space-y-2">
          <label className="block h4 text-black">전체 설정</label>
          <div className="flex gap-3 w-full">
            <div className="flex-1">
              <TimeSelectionDropdown start_time="09:00" end_time="18:30" label="" />
            </div>
            <div className="flex-1">
              <TimeSelectionDropdown start_time="09:00" end_time="18:30" label="" />
            </div>
          </div>
        </div>

        {/* 요일별 설정 */}
        <div className="space-y-4">
          <label className="block h4 text-black">요일별 설정</label>
          {days.map((day) => (
            <div key={day} className="flex items-center gap-3">
              <span className="w-6 text-black h4">{day}</span>
              <div className="flex-1">
                <TimeSelectionDropdown start_time="09:00" end_time="18:30" label="" />
              </div>
              <div className="flex-1">
                <TimeSelectionDropdown start_time="09:00" end_time="18:30" label="" />
              </div>
            </div>
          ))}
        </div>

        {/* 등록 버튼 */}
        <div className="pt-4">
          <Button
            color="gray"
            text="등록하기"
            onClick={() => alert('근무시간 등록 완료')}
          />
        </div>
      </div>
    </>
  );
}
