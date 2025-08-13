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

  // 휴대폰 번호 11자리 제한
  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/[^\d]/g, '');
    // 11자리로 제한
    const limitedNumbers = numbers.slice(0, 11);

    // 길이에 따라 하이픈 추가
    if (limitedNumbers.length <= 3) {
      return limitedNumbers;
    } else if (limitedNumbers.length <= 7) {
      return `${limitedNumbers.slice(0, 3)}-${limitedNumbers.slice(3)}`;
    } else {
      return `${limitedNumbers.slice(0, 3)}-${limitedNumbers.slice(3, 7)}-${limitedNumbers.slice(7)}`;
    }
  };

  // 생년월일 8자리 제한
  const formatBirthDate = (value: string) => {
    // 숫자만 추출
    const numbers = value.replace(/[^\d]/g, '');
    // 8자리로 제한
    const limitedNumbers = numbers.slice(0, 8);

    // 길이에 따라 점 추가
    if (limitedNumbers.length <= 4) {
      return limitedNumbers;
    } else if (limitedNumbers.length <= 6) {
      return `${limitedNumbers.slice(0, 4)}.${limitedNumbers.slice(4)}`;
    } else {
      return `${limitedNumbers.slice(0, 4)}.${limitedNumbers.slice(4, 6)}.${limitedNumbers.slice(6)}`;
    }
  };

  useEffect(() => {
    const fetchOwner = async () => {
      const data = await getOwnerInfo();
      setName(data.name);
      // 백엔드에서 받은 데이터를 포맷팅해서 화면에 표시
      setPhone(formatPhoneNumber(data.phone));
      setBirth(formatBirthDate(data.birth));
      setIsLoading(false);
    };
    fetchOwner();
  }, []);

  if (isLoading) {
    return <div className="text-center mt-20">불러오는 중...</div>;
  }

  // 입력값 변경 핸들러
  const handleInputChange = (fieldName: string, value: string) => {
    if (fieldName === 'name') {
      setName(value);
    } else if (fieldName === 'phone') {
      const formattedValue = formatPhoneNumber(value);
      setPhone(formattedValue);
    } else if (fieldName === 'birth') {
      const formattedValue = formatBirthDate(value);
      setBirth(formattedValue);
    }
  };

  const handleSubmit = async () => {
    try {
      // 백엔드로 전송할 때는 하이픈 포함된 형태로 전송
      const birthNumbers = birth.replace(/[^\d]/g, ''); // 점 제거
      const formattedBirth = `${birthNumbers.slice(0, 4)}-${birthNumbers.slice(4, 6)}-${birthNumbers.slice(6, 8)}`; // YYYY-MM-DD

      const payload = {
        name,
        phone: phone, // "010-1234-5678" (하이픈 포함)
        birth: formattedBirth, // "2025-04-09" (하이픈 포함)
      };

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
        <Input
          id="name"
          label="이름"
          value={name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          disabled={false}
        />
        <Input
          id="birth"
          label="생년월일"
          value={birth}
          onChange={(e) => handleInputChange('birth', e.target.value)}
          disabled={false}
        />
        <Input
          id="phone"
          label="전화번호"
          value={phone}
          onChange={(e) => handleInputChange('phone', e.target.value)}
          disabled={false}
        />
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
