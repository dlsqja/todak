import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import BackHeader from '@/component/header/BackHeader';
import ImageInputBox from '@/component/input/ImageInputBox';
import Input from '@/component/input/Input';
import Button from '@/component/button/Button';
import SelectionDropdown from '@/component/selection/SelectionDropdown';

import { registerPet } from '@/services/api/Owner/ownerpet'; // ✅ API import

export default function OwnerPetRegister() {
  const navigate = useNavigate();

  const [image, setImage] = useState<File | null>(null); // File 객체로 저장
  const [name, setName] = useState('');
  const [age, setAge] = useState('');          // 문자열 유지
  const [weight, setWeight] = useState('');    // 문자열 유지
  const [gender, setGender] = useState('');    // 성별 + 중성화 여부
  const [type, setType] = useState('');

  // ▼ 드롭다운 동시 오픈 방지용 전역 상태
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null); // file input에 접근하기 위한 ref

  // 성별 + 중성화 여부 결합
  const genderMap = {
    '남(중성화)': 'MALE_NEUTERING',
    '여(중성화)': 'FEMALE_NEUTERING',
    남: 'MALE',
    여: 'FEMALE',
    '성별 없음': 'NON',
  };

  const typeMap = { 강아지: 'DOG', 고양이: 'CAT', 기타: 'OTHER' };

  // SelectionDropdown용 옵션 배열
  const genderOptions = [
    { value: '남', label: '남' },
    { value: '여', label: '여' },
    { value: '남(중성화)', label: '남(중성화)' },
    { value: '여(중성화)', label: '여(중성화)' },
    { value: '성별 없음', label: '성별 없음' },
  ];

  const typeOptions = [
    { value: '강아지', label: '강아지' },
    { value: '고양이', label: '고양이' },
    { value: '기타', label: '기타' },
  ];

  const handleImageChange = (newImage: File | null) => {
    setImage(newImage); // 선택된 이미지 파일을 상태로 저장
  };

  const handleImageUpload = () => {
    fileInputRef.current?.click(); // 파일 선택 창 열기
  };

  const handleRemoveImage = () => {
    setImage(null); // 선택된 이미지 제거
  };

  // ===== 나이: 양수 정수만 허용 (1~100) =====
  const sanitizeAgeInput = (v: string) => v.replace(/[^\d]/g, '');
  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAge(sanitizeAgeInput(e.target.value));
  };
  const validateAndNormalizeAge = (ageStr: string): number | null => {
    const s = (ageStr ?? '').trim();
    if (!/^\d+$/.test(s)) return null;
    const num = parseInt(s, 10);
    if (!Number.isFinite(num)) return null;
    if (num < 1 || num > 100) return null;
    return num;
  };

  // ===== 몸무게: 입력 정리(소수 한 자리) + 유효성(0~200) =====
  const sanitizeWeightInput = (v: string) => {
    const noMinus = v.replace(/-/g, '');
    let cleaned = noMinus.replace(/[^\d.]/g, '');
    const firstDot = cleaned.indexOf('.');
    if (firstDot !== -1) {
      cleaned = cleaned.slice(0, firstDot + 1) + cleaned.slice(firstDot + 1).replace(/\./g, '');
    }
    const [i = '', d] = cleaned.split('.');
    if (d === undefined) return i;     // 정수만
    if (d === '') return `${i}.`;      // 입력 중 '2.' 유지
    return `${i}.${d.slice(0, 1)}`;    // 소수 1자리
  };
  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWeight(sanitizeWeightInput(e.target.value));
  };
  const validateAndNormalizeWeight = (weightStr: unknown): number | null => {
    const s = String(weightStr ?? '').trim();
    if (!s) return null;
    if (!/^\d+(\.\d)?$/.test(s)) return null;      // 정수 또는 소수 1자리
    const num = Number.parseFloat(s);
    if (!Number.isFinite(num)) return null;
    if (num < 0 || num > 200) return null;
    return Math.round(num * 10) / 10;              // 소수 1자리 고정
  };

  const handleSubmit = async () => {
    // ✅ 유효성 검사 (OwnerPetEdit과 동일 규칙)
    const normalizedAge = validateAndNormalizeAge(age);
    if (normalizedAge === null) {
      alert('나이는 1~100 사이의 양수 정수만 입력할 수 있어요.\n예) 6, 12, 100');
      return;
    }
    setAge(String(normalizedAge));

    const normalizedWeight = validateAndNormalizeWeight(weight);
    if (normalizedWeight === null) {
      alert('몸무게는 0 이상 200 이하의 숫자로 입력해주세요.\n예) 3 또는 3.5 (소수 한 자리까지)');
      return;
    }
    const weightFixed = Number(Math.round(normalizedWeight * 10) / 10);
    setWeight(weightFixed.toFixed(1)); // UI 표시 보정

    try {
      // genderMap/typeMap 변환
      const genderValue = genderMap[gender];
      const typeValue = typeMap[type];

      // **페이로드 키는 원본 그대로** 유지
      const petRequest = {
        name,
        age: normalizedAge,        // 정제된 값 사용
        gender: genderValue,
        species: typeValue,
        weight: weightFixed,       // 정제된 값 사용
      };

      // console.log('Pet Request:', petRequest);

      await registerPet({ petRequest, photo: image }); // ✅ API 호출
      alert('등록되었습니다');
      navigate(-1);
    } catch (err) {
      // console.error('❌ 등록 실패:', err);
      alert('등록에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className="pb-20 space-y-6">
      <BackHeader text="반려동물 등록" />
      <div className="px-7">
        {/* 이미지 등록 */}
        <div className="flex flex-col items-center space-y-2 pb-6">
          <ImageInputBox
            src={image ? URL.createObjectURL(image) : ''} // 이미지 미리보기
          />
          <input
            type="file"
            ref={fileInputRef} // 파일 선택에 사용할 input
            onChange={(e) => handleImageChange(e.target.files?.[0] ?? null)} // 파일 선택 후 처리
            accept="image/*" // 이미지 파일만 허용
            className="hidden" // input은 숨겨놓고 버튼을 통해 클릭
          />
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

        {/* 입력 폼 */}
        <div className="space-y-5">
          <Input
            id="name"
            label="이름"
            placeholder="반려동물 이름을 입력해주세요"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <div className="flex gap-4">
            <Input
              id="age"
              label="나이"
              placeholder="0"
              value={age}
              onChange={handleAgeChange}               // ✅ 유효성 포함
            />
            <Input
              id="weight"
              label="체중(kg)"
              placeholder="0.0"
              value={weight}
              onChange={handleWeightChange}            // ✅ 유효성 포함
            />
          </div>

          {/* 드롭다운 (SelectionDropdown 적용) */}
          <div className="flex gap-4">
            <div className="flex flex-col w-full">
              <label htmlFor="gender" className="h4 mb-2 text-black">성별</label>
              <SelectionDropdown
                dropdownId="gender"
                options={genderOptions}
                placeholder="성별을 선택해주세요"
                value={gender}
                onChange={(v) => setGender(v)}
                activeDropdown={activeDropdownId}
                setActiveDropdown={setActiveDropdownId}
              />
            </div>
          </div>

          <div className="flex flex-col w-full">
            <label htmlFor="type" className="h4 mb-2 text-black">종</label>
            <SelectionDropdown
              dropdownId="type"
              options={typeOptions}
              placeholder="반려동물 종을 선택해주세요"
              value={type}
              onChange={(v) => setType(v)}
              activeDropdown={activeDropdownId}
              setActiveDropdown={setActiveDropdownId}
            />
          </div>
        </div>

        {/* 등록 버튼 */}
        <div className="mt-6">
          <Button text="반려동물 등록하기" color="green" onClick={handleSubmit} />
        </div>
      </div>
    </div>
  );
}
