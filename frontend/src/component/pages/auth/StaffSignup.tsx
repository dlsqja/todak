import React, { useState } from 'react';
import '@/styles/main.css';
import BackHeader from '@/component/header/BackHeader';
import Input from '@/component/input/Input';
import Button from '@/component/button/Button';
import { useNavigate, useParams } from 'react-router-dom';
import { authAPI } from '@/services/api/auth';

export default function StaffSignup() {
  const navigate = useNavigate();
  const { authId } = useParams();
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
        [fieldName]: `${
          fieldName === 'hospitalCode'
            ? '병원 코드를 입력해주세요.'
            : fieldName === 'name'
            ? '이름을 입력해주세요.'
            : ''
        }`,
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
    // 직접 유효성 검사 수행
    const hospitalCodeError = !hospitalCode.trim() ? '병원 코드를 입력해주세요.' : '';
    const nameError = !name.trim() ? '이름을 입력해주세요.' : '';

    // 에러가 있으면 상태 업데이트 후 중단
    if (hospitalCodeError || nameError) {
      setErrors({
        hospitalCode: hospitalCodeError,
        name: nameError,
      });
      // console.log('유효성 검사 실패');
      return;
    }

    // 유효성 검사 통과 시 진행
    // console.log('유효성 검사 통과');

    setIsLoading(true);

    // authId 확인
    const urlParams = window.location.pathname.split('/');
    const authId = urlParams[3];
    // console.log('pathname', urlParams);
    // console.log('authId', authId);

    if (!authId) {
      // console.log('authId from useParams:', authId);
      alert('인증 정보가 없습니다. 다시 로그인해주세요.');
      setIsLoading(false);
      return;
    }
    // console.log('hospitalCode', hospitalCode);
    try {
      const response = await authAPI.staffSignup(
        {
          hospitalCode: hospitalCode.trim(),
          name: name.trim(),
        },
        authId,
      );

      // console.log('response', response);

      if (response.message === '성공') {
        alert('병원 관계자 가입이 완료되었습니다!');
        navigate('/staff/home');
      } else {
        alert('병원 관계자 가입에 실패했습니다. 다시 시도해주세요.');
      }
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
            <p
              className="text-gray-500 caption mt-1 ml-2 cursor-pointer"
              onClick={() => alert('병원 담당자에게 문의하세요')}
            >
              병원코드가 없으신가요?
            </p>
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
