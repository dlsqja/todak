// 병원 관계자 병원관리 - 병원 정보 관리

import React, { useState, useEffect } from 'react';
import '@/styles/main.css';

import BackHeader from '@/component/header/BackHeader';
import Input from '@/component/input/Input';
import SearchInput from '@/component/input/SearchInput';
import Button from '@/component/button/Button';

// 더미데이터 호출
import { mockHospitalInfo } from './mockHospitalInfo';

export default function StaffHospitalInfo() {
  const [hospitalCode, setHospitalCode] = useState('');
  const [hospitalName, setHospitalName] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    setHospitalCode(mockHospitalInfo.code);
    setHospitalName(mockHospitalInfo.name);
    setRegistrationNumber(mockHospitalInfo.registrationNumber);
    setDescription(mockHospitalInfo.description);
    setLocation(mockHospitalInfo.location);
    setPhone(mockHospitalInfo.phone);
  }, []);


  return (
    <>
      <BackHeader text="병원 정보 관리" />
    <div className="px-5 pb-24 pt-4 space-y-6">

      <Input
        id="hospitalCode"
        label="병원 코드"
        value={hospitalCode}
        onChange={(e) => setHospitalCode(e.target.value)}
        disabled
      />

      <Input
        id="hospitalName"
        label="병원 이름"
        value={hospitalName}
        onChange={(e) => setHospitalName(e.target.value)}
      />

      <Input
        id="registrationNumber"
        label="병원 사업자등록번호"
        value={registrationNumber}
        onChange={(e) => setRegistrationNumber(e.target.value)}
      />

      <Input
        id="description"
        label="병원 소개글"
        placeholder="병원 소개글을 입력해주세요"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <SearchInput
        id="location"
        label="병원 위치"
        placeholder="예) 강남구 역삼동 123-45 (혹은 건물명)"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />

      <Input
        id="phone"
        label="병원 전화번호"
        placeholder="02-1234-5678"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <div className="pt-4">
        <Button
          color="green"
          text="수정하기"
          onClick={() => alert('수정 완료!')}
        />
      </div>
    </div>
    </>
  );
}
