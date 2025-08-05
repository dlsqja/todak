import React from 'react';
import '@/styles/main.css';
import BackHeader from '@/component/header/BackHeader';
import Input from '@/component/input/Input';

export default function OwnerMyPage() {
  return (
    <>
      <BackHeader text="마이페이지" />
      <div className="flex flex-col gap-6 px-4 mt-11">
        <Input id="name" label="이름" value="김싸피" disabled={true} />
        <Input id="birth" label="생년월일" value="1998.12.23" disabled={true} />
        <Input id="phone" label="전화번호" value="010-3953-8888" disabled={true} />
      </div>
      <br />
      <div className="flex justify-center gap-2">
        <button className="h4 text-center text-gray-500 cursor-pointer">로그 아웃</button>
        <span className="text-gray-500"> | </span>
        <button className="h4 text-center text-gray-500 cursor-pointer">회원 탈퇴</button>
      </div>
    </>
  );
}
