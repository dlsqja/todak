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
  const [licenseNumber, setLicenseNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 각 필드별 에러 상태 관리
  const [errors, setErrors] = useState({
    hospitalCode: '',
    name: '',
    licenseNumber: '',
  });

  // 면허번호 5자리 제한 함수
  const formatLicenseNumber = (value: string) => {
    // 숫자만 추출
    const numbers = value.replace(/[^\d]/g, '');
    // 5자리로 제한
    return numbers.slice(0, 5);
  };

  // 실시간 유효성 검사
  const validateField = (fieldName: string, value: string) => {
    if (!value.trim()) {
      setErrors((prev) => ({
        ...prev,
        [fieldName]: `${
          fieldName === 'hospitalCode'
            ? '병원 코드를 입력해주세요.'
            : fieldName === 'name'
            ? '이름을 입력해주세요.'
            : '면허번호를 입력해주세요.'
        }`,
      }));
    } else {
      // 면허번호 길이 검사 추가
      if (fieldName === 'licenseNumber') {
        const numbers = value.replace(/[^\d]/g, '');
        if (numbers.length !== 5) {
          setErrors((prev) => ({
            ...prev,
            [fieldName]: '면허번호는 5자리여야 합니다.',
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
    if (fieldName === 'hospitalCode') setHospitalCode(value);
    if (fieldName === 'name') setName(value);
    if (fieldName === 'licenseNumber') {
      const formattedValue = formatLicenseNumber(value);
      setLicenseNumber(formattedValue);
    }

    // 실시간 유효성 검사
    validateField(fieldName, fieldName === 'licenseNumber' ? formatLicenseNumber(value) : value);
  };

  const handleSubmit = async () => {
    // 최종 유효성 검사
    validateField('hospitalCode', hospitalCode);
    validateField('name', name);
    validateField('licenseNumber', licenseNumber);

    // 에러가 있으면 제출 중단
    if (
      errors.hospitalCode ||
      errors.name ||
      errors.licenseNumber ||
      !hospitalCode.trim() ||
      !name.trim() ||
      !licenseNumber.trim()
    ) {
      return;
    }

    setIsLoading(true);
    try {
      await authAPI.vetSignup({
        hospital_code: hospitalCode.trim(),
        name: name.trim(),
        license_number: licenseNumber.trim(),
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
        <div>
          <Input
            id="licenseNumber"
            label="면허번호"
            placeholder="면허번호 5자리를 입력해주세요"
            value={licenseNumber}
            onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
            disabled={false}
          />
          {errors.licenseNumber && <p className="text-red-500 caption mt-1 ml-2">{errors.licenseNumber}</p>}
        </div>
      </div>
      <br />
      <div className="px-7 mt-6">
        <Button text={isLoading ? '등록 중...' : '등록하기'} onClick={handleSubmit} color="green" />
      </div>
    </>
  );
}
