import React, { useState } from 'react';
import '@/styles/main.css';
import BackHeader from '@/component/header/BackHeader';
import Input from '@/component/input/Input';
import Button from '@/component/button/Button';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '@/api/auth';

export default function OwnerSignup() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [birth, setBirth] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPhoneAuth, setIsPhoneAuth] = useState(false);

  // 각 필드별 에러 상태 관리
  const [errors, setErrors] = useState({
    name: '',
    phone: '',
    birth: '',
    authCode: '',
  });

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

  // 실시간 유효성 검사 (길이 검사 추가)
  const validateField = (fieldName: string, value: string) => {
    if (!value.trim()) {
      setErrors((prev) => ({
        ...prev,
        [fieldName]: `${
          fieldName === 'name'
            ? '이름을 입력해주세요.'
            : fieldName === 'phone'
            ? '휴대폰 번호를 입력해주세요.'
            : fieldName === 'authCode'
            ? '인증번호를 입력해주세요.'
            : '생년월일을 입력해주세요.'
        }`,
      }));
    } else {
      // 길이 검사 추가
      if (fieldName === 'phone') {
        const numbers = value.replace(/[^\d]/g, '');
        if (numbers.length !== 11) {
          setErrors((prev) => ({
            ...prev,
            [fieldName]: '휴대폰 번호를 올바르게 입력해주세요.',
          }));
          return;
        }
      }

      if (fieldName === 'birth') {
        const numbers = value.replace(/[^\d]/g, '');
        if (numbers.length !== 8) {
          setErrors((prev) => ({
            ...prev,
            [fieldName]: '생년월일을 올바르게 입력해주세요.',
          }));
          return;
        }
      }

      // 모든 검사를 통과하면 에러 제거
      setErrors((prev) => ({
        ...prev,
        [fieldName]: '',
      }));
    }
  };

  // 입력값 변경 핸들러
  const handleInputChange = (fieldName: string, value: string) => {
    if (fieldName === 'name') setName(value);
    if (fieldName === 'phone') {
      const formattedValue = formatPhoneNumber(value);
      setPhone(formattedValue);
    }
    if (fieldName === 'birth') {
      const formattedValue = formatBirthDate(value);
      setBirth(formattedValue);
    }
    if (fieldName === 'authCode') setAuthCode(value);

    // 실시간 유효성 검사
    validateField(
      fieldName,
      fieldName === 'phone' ? formatPhoneNumber(value) : fieldName === 'birth' ? formatBirthDate(value) : value,
    );
  };

  const handleSubmit = async () => {
    // 최종 유효성 검사
    validateField('name', name);
    validateField('phone', phone);
    validateField('birth', birth);
    validateField('authCode', authCode);

    // 에러가 있으면 제출 중단
    if (
      errors.name ||
      errors.phone ||
      errors.birth ||
      errors.authCode ||
      !name.trim() ||
      !phone.trim() ||
      !birth.trim() ||
      !authCode.trim()
    ) {
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
      <BackHeader text="회원 가입" />
      <div className="flex flex-col gap-6 px-7 mt-11">
        <div>
          <Input
            id="name"
            label="이름"
            placeholder="이름을 입력해주세요"
            value={name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            disabled={false}
          />
          {errors.name && <p className="text-red-500 caption mt-1 ml-2">{errors.name}</p>}
        </div>
        <div>
          <Input
            id="phone"
            label="휴대폰"
            placeholder="휴대폰 번호를 '-' 제외하고 입력해주세요"
            value={phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            disabled={false}
          />
          {errors.phone && <p className="text-red-500 caption mt-1 ml-2">{errors.phone}</p>}
        </div>
        <div>
          <Input
            id="birth"
            label="생년월일"
            placeholder="생년월일 8자리를 입력해주세요"
            value={birth}
            onChange={(e) => handleInputChange('birth', e.target.value)}
            disabled={false}
          />
          {errors.birth && <p className="text-red-500 caption mt-1 ml-2">{errors.birth}</p>}
        </div>
      </div>
      <br />
      <div className="px-7 mt-6">
        <Button text={isLoading ? '등록 중...' : '등록하기'} onClick={handleSubmit} color="green" />
      </div>
    </>
  );
}
