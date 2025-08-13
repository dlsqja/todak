import React from 'react';
import '@/styles/main.css';
import SimpleHeader from '@/component/header/SimpleHeader';
import Input from '@/component/input/Input';
import Button from '@/component/button/Button';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOwnerInfo, updateOwnerInfo } from '@/services/api/Owner/ownermypage';
import { motion } from 'framer-motion'; // 애니메이션을 위한 추가 import
import { authAPI } from '@/services/api/auth';

export default function OwnerMyPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [birth, setBirth] = useState('');

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOwner = async () => {
      const data = await getOwnerInfo();
      setName(data.name);
      setPhone(data.phone);
      setBirth(data.birth);
      setIsLoading(false);
    };
    fetchOwner();
  }, []);

  if (isLoading) {
    return <div className="text-center mt-20">불러오는 중...</div>;
  }

  const handleSubmit = async () => {
    try {
      const payload = { name, phone, birth };
      const response = await updateOwnerInfo(payload);
      alert('수정 완료!');
      navigate('/owner/mypage');
    } catch (error) {
      console.error('수정 실패', error);
      alert('수정 실패!');
    }
  };

  const handleLogout = async () => {
    await authAPI.logout();
    navigate(`/auth/`);
  };

  return (
    <>
      <SimpleHeader text="마이페이지" />
      <div className="flex flex-col gap-6 px-7 mt-11">
        <Input id="name" label="이름" value={name} onChange={(e) => setName(e.target.value)} disabled={false} />
        <Input id="birth" label="생년월일" value={birth} onChange={(e) => setBirth(e.target.value)} disabled={false} />
        <Input id="phone" label="전화번호" value={phone} onChange={(e) => setPhone(e.target.value)} disabled={false} />
      </div>
      <br />
      <motion.div
        className="px-7 mt-6"
        initial={{ opacity: 0, y: 10 }} // 애니메이션 초기 상태
        animate={{ opacity: 1, y: 0 }} // 애니메이션 종료 상태
        transition={{ duration: 0.3 }} // 애니메이션 지속 시간
      >
        <Button text="수정하기" onClick={handleSubmit} color="green" />
      </motion.div>
      <motion.div
        className="flex justify-center gap-2 mt-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }} // 딜레이로 순차적으로 나타나도록
      >
        <motion.button
          className="h4 text-center text-gray-500 cursor-pointer"
          onClick={handleLogout}
          whileHover={{ scale: 1.05 }} // hover시 효과 추가
          transition={{ duration: 0.2 }}
        >
          로그 아웃
        </motion.button>
        <span className="text-gray-500"> | </span>
        <motion.button
          className="h4 text-center text-gray-500 cursor-pointer"
          whileHover={{ scale: 1.05 }} // hover시 효과 추가
          transition={{ duration: 0.2 }}
        >
          회원 탈퇴
        </motion.button>
      </motion.div>
    </>
  );
}
