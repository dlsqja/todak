import React from 'react';
import '@/styles/main.css';
import BackHeader from '@/component/header/BackHeader';
import Input from '@/component/input/Input';
import Button from '@/component/button/Button';
import { useState } from 'react';

export default function OwnerMyPage() {
  const [name, setName] = useState('테스트 이름');
  const [phone, setPhone] = useState('테스트 전화번호');
  const [birth, setBirth] = useState('테스트 생일');

  const handleSubmit = () => {
    console.log('제출할 이름:', name);
    console.log('제출할 생일:', birth);
    console.log('제출할 전화번호:', phone);
    alert(`수정 완료`);
  };

  return (
    <>
      <BackHeader text="마이페이지" />
      <div className="flex flex-col gap-6 px-7 mt-11">
        <Input id="name" label="이름" value={name} onChange={(e) => setName(e.target.value)} disabled={false} />
        <Input id="birth" label="생년월일" value={birth} onChange={(e) => setBirth(e.target.value)} disabled={false} />
        <Input id="phone" label="전화번호" value={phone} onChange={(e) => setPhone(e.target.value)} disabled={false} />
      </div>
      <br />
      <div className="px-7 mt-6">
        <Button text="수정하기" onClick={handleSubmit} color="green" />
      </div>
      <div className="flex justify-center gap-2 mt-2">
        <button className="h4 text-center text-gray-500 cursor-pointer">로그 아웃</button>
        <span className="text-gray-500"> | </span>
        <button className="h4 text-center text-gray-500 cursor-pointer">회원 탈퇴</button>
      </div>
    </>
  );
}
