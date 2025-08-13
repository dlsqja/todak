import React, { useState } from 'react';
import '@/styles/main.css';
import BackHeader from '@/component/header/BackHeader';
import Input from '@/component/input/Input';
import Button from '@/component/button/Button';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '@/services/api/auth';

export default function OwnerSignup() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [birth, setBirth] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 각 필드별 에러 상태 관리
  const [errors, setErrors] = useState({
    name: '',
    phone: '',
    birth: '',
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
            : fieldName === 'birth'
            ? '생년월일을 입력해주세요.'
            : ''
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

    // 실시간 유효성 검사
    validateField(
      fieldName,
      fieldName === 'phone' ? formatPhoneNumber(value) : fieldName === 'birth' ? formatBirthDate(value) : value,
    );
  };

  const handleSubmit = async () => {
    // 직접 유효성 검사 수행
    const nameError = !name.trim() ? '이름을 입력해주세요.' : '';
    const phoneNumbers = phone.replace(/[^\d]/g, '');
    const phoneError = !phone.trim()
      ? '휴대폰 번호를 입력해주세요.'
      : phoneNumbers.length !== 11
      ? '휴대폰 번호를 올바르게 입력해주세요.'
      : '';

    const birthNumbers = birth.replace(/[^\d]/g, '');
    const birthError = !birth.trim()
      ? '생년월일을 입력해주세요.'
      : birthNumbers.length !== 8
      ? '생년월일을 올바르게 입력해주세요.'
      : '';

    // 에러가 있으면 상태 업데이트 후 중단
    if (nameError || phoneError || birthError) {
      setErrors({
        name: nameError,
        phone: phoneError,
        birth: birthError,
      });
      console.log('유효성 검사 실패');
      return;
    }

    // 유효성 검사 통과 시 진행
    console.log('유효성 검사 통과');
    setIsLoading(true);

    // URL에서 authId 가져오기 (카카오 로그인 후 전달받은 값)
    const urlParams = window.location.pathname.split('/');
    const authId = urlParams[3];
    console.log('pathname', urlParams);
    console.log('authId', authId);

    if (!authId) {
      console.log('authId', authId);
      alert('인증 정보가 없습니다. 다시 로그인해주세요.');
      return;
    }

    // 생년월일을 YYYY-MM-DD 형태로 변환
    const formattedBirth = `${birthNumbers.slice(0, 4)}-${birthNumbers.slice(4, 6)}-${birthNumbers.slice(6, 8)}`; // "2025-04-09"

    const response = await authAPI.ownerSignup(
      {
        name: name.trim(),
        phone: phone,
        birth: formattedBirth,
      },
      authId,
    );
    console.log('response.message', response.message);

    if (response.message === '성공') {
      alert('반려인 가입이 완료되었습니다!');
      navigate('/owner/home');
    } else {
      alert('반려인 가입에 실패했습니다. 다시 시도해주세요.');
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
