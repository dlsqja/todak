import React from 'react';
import '@/styles/main.css';
import BackHeader from '@/component/header/BackHeader';
import Input from '@/component/input/Input';
import Button from '@/component/button/Button';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '@/api/auth';

export default function StaffSignup() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [birth, setBirth] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    // 입력값 검증
    if (!name.trim() || !phone.trim() || !birth.trim()) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      await authAPI.ownerSignup({
        name: name.trim(),
        phone: phone.trim(),
        birth: birth.trim(),
      });

      alert('회원가입이 완료되었습니다!');
      navigate('/owner/home');
    } catch (error) {
      console.error('회원가입 실패:', error);
      alert('회원가입에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
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
        <Button text={isLoading ? '등록 중...' : '등록하기'} onClick={handleSubmit} color="green" />
      </div>
    </>
  );
}
