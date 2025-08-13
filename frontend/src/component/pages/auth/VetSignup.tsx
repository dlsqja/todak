import React, { useState, useRef } from 'react';
import '@/styles/main.css';
import BackHeader from '@/component/header/BackHeader';
import Input from '@/component/input/Input';
import Button from '@/component/button/Button';
import { useNavigate, useParams } from 'react-router-dom';
import { authAPI } from '@/services/api/auth';

export default function VetSignup() {
  const navigate = useNavigate();
  const { authId } = useParams();
  const [hospitalCode, setHospitalCode] = useState('');
  const [name, setName] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [profile, setProfile] = useState('');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 각 필드별 에러 상태 관리
  const [errors, setErrors] = useState({
    hospitalCode: '',
    name: '',
    licenseNumber: '',
    profile: '',
    photo: '',
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
            : fieldName === 'licenseNumber'
            ? '면허번호를 입력해주세요.'
            : fieldName === 'profile'
            ? '본인 소개글을 입력해주세요.'
            : ''
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
    if (fieldName === 'profile') setProfile(value);
    if (fieldName === 'licenseNumber') {
      const formattedValue = formatLicenseNumber(value);
      setLicenseNumber(formattedValue);
    }

    // 실시간 유효성 검사
    validateField(fieldName, fieldName === 'licenseNumber' ? formatLicenseNumber(value) : value);
  };

  // 이미지 클릭 핸들러
  const handleImageUpload = () => {
    fileInputRef.current?.click(); // 파일 선택 창 열기
  };

  const handleRemoveImage = () => {
    setProfileImage(null); // 선택된 이미지 제거
    setPreviewImage(null); // 미리보기 이미지도 제거하여 기본 이미지로 복원
  };

  // 파일 선택 핸들러
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // 이미지 미리보기 생성
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // 파일 상태 저장
      setProfileImage(file);
    }
  };

  const handleSubmit = async () => {
    // 직접 유효성 검사 수행
    const hospitalCodeError = !hospitalCode.trim() ? '병원 코드를 입력해주세요.' : '';
    const nameError = !name.trim() ? '이름을 입력해주세요.' : '';
    const profileError = !profile.trim() ? '소개글을 입력해주세요.' : '';

    const licenseNumbers = licenseNumber.replace(/[^\d]/g, '');
    const licenseError = !licenseNumber.trim()
      ? '면허번호를 입력해주세요.'
      : licenseNumbers.length !== 5
      ? '면허번호는 5자리여야 합니다.'
      : '';

    // 에러가 있으면 상태 업데이트 후 중단
    if (hospitalCodeError || nameError || licenseError || profileError) {
      setErrors({
        hospitalCode: hospitalCodeError,
        name: nameError,
        licenseNumber: licenseError,
        profile: profileError,
        photo: '',
      });
      console.log('유효성 검사 실패');
      return;
    }

    // 유효성 검사 통과 시 진행
    console.log('유효성 검사 통과');

    setIsLoading(true);

    // authId 확인
    const urlParams = window.location.pathname.split('/');
    const authId = urlParams[3];
    console.log('pathname', urlParams);
    console.log('authId', authId);

    if (!authId) {
      console.log('authId from useParams:', authId);
      alert('인증 정보가 없습니다. 다시 로그인해주세요.');
      setIsLoading(false);
      return;
    }

    // 프로필 이미지 처리 - 선택하지 않으면 기본 이미지 사용
    const photoToSend = profileImage ? profileImage.name : '/images/pet_default.png';

    const response = await authAPI.vetSignup(
      {
        name: name.trim(),
        license: licenseNumber.trim(),
        hospitalCode: hospitalCode.trim(),
        profile: profile.trim() || '안녕하세요. 수의사입니다.',
        photo: photoToSend,
      },
      authId,
    );

    console.log('response', response);

    // if (response.message === '성공') {
    //   alert('회원가입이 완료되었습니다!');
    //   navigate('/vet/home');
    // } else {
    //   alert('회원가입에 실패했습니다. 다시 시도해주세요.');
    // }
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
        <div>
          <label className="block h4 text-black mb-2">소개글</label>
          <textarea
            id="profile"
            placeholder="본인 소개를 입력해주세요"
            value={profile}
            onChange={(e) => handleInputChange('profile', e.target.value)}
            disabled={false}
            rows={5}
            className="w-full placeholder:text-gray-500 p-3 border whitespace-pre-wrap word-wrap break-words line-height-1.5 border-gray-400 rounded-lg resize-none focus:outline-none focus:border-green-300 focus:border-2"
          />
          {errors.profile && <p className="text-red-500 caption ml-2">{errors.profile}</p>}
        </div>
        <div>
          <label className="block h4 text-black mb-2">프로필 사진</label>
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
          <div className="flex items-center gap-4">
            <div className="w-22 h-22 bg-green-100 border-3 border-green-200 rounded-[12px] flex items-center justify-center overflow-hidden">
              <img
                src={previewImage || '/images/pet_default.png'}
                alt="프로필 사진"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col gap-2">
              <button
                className="text-white bg-green-300 px-4 py-1 rounded-xl h5 cursor-pointer"
                onClick={handleImageUpload} // 사진 등록 버튼 클릭 시 파일 선택 창 열기
              >
                사진 등록
              </button>
              <button
                className="text-gray-400 bg-gray-100 px-4 py-1 rounded-xl h5 cursor-pointer"
                onClick={handleRemoveImage} // 사진 제거 버튼 클릭 시 이미지 제거
              >
                사진 제거
              </button>
            </div>
          </div>
        </div>
      </div>
      <br />
      <div className="px-7 mt-6">
        <Button text={isLoading ? '등록 중...' : '등록하기'} onClick={handleSubmit} color="green" />
      </div>
    </>
  );
}
