import React, { useState } from 'react';
import '@/styles/main.css';
import BackHeader from '@/component/header/BackHeader';
import Input from '@/component/input/Input';
import Button from '@/component/button/Button';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '@/api/auth';

export default function VetSignup() {
  const navigate = useNavigate();
  const [hospitalCode, setHospitalCode] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 각 필드별 에러 상태 관리
  const [errors, setErrors] = useState({
    hospitalCode: '',
    name: '',
  });

  // 실시간 유효성 검사
  const validateField = (fieldName: string, value: string) => {
    if (!value.trim()) {
      setErrors((prev) => ({
        ...prev,
        [fieldName]: `${fieldName === 'hospitalCode' ? '병원 코드를 입력해주세요.' : '이름을 입력해주세요.'}`,
      }));
    } else {
      // 모든 검사를 통과하면 에러 제거
      setErrors((prev) => ({
        ...prev,
        [fieldName]: '',
      }));
    }
  };

  // 입력값 변경 핸들러
  const handleInputChange = (fieldName: string, value: string) => {
    if (fieldName === 'hospitalCode') setHospitalCode(value);
    if (fieldName === 'name') setName(value);

    // 실시간 유효성 검사
    validateField(fieldName, value);
  };

  const handleSubmit = async () => {
    // 최종 유효성 검사
    validateField('hospitalCode', hospitalCode);
    validateField('name', name);

    // 에러가 있으면 제출 중단
    if (errors.hospitalCode || errors.name || !hospitalCode.trim() || !name.trim()) {
      return;
    }

    setIsLoading(true);
    try {
      await authAPI.staffSignup({
        hospital_code: hospitalCode.trim(),
        name: name.trim(),
      });

      alert('회원가입이 완료되었습니다!');
      navigate('/vet/home');
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
            id="hospitalCode"
            label="병원 코드"
            placeholder="병원 코드를 입력해주세요"
            value={hospitalCode}
            onChange={(e) => handleInputChange('hospitalCode', e.target.value)}
            disabled={false}
          />
          <div className="flex justify-between gap-1">
            {errors.hospitalCode && <p className="text-red-500 caption mt-1 ml-2">{errors.hospitalCode}</p>}
            <p className="text-gray-500 caption mt-1 ml-2 cursor-pointer">병원코드가 없으신가요?</p>
          </div>
        </div>
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
      </div>
      <br />
      <div className="px-7 mt-6">
        <Button text={isLoading ? '등록 중...' : '등록하기'} onClick={handleSubmit} color="green" />
      </div>
    </>
  );
}
