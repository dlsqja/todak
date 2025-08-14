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
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [gender, setGender] = useState(''); // 성별 + 중성화 여부
  const [type, setType] = useState('');
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

  const typeMap = { 강아지: 'DOG', 고양이: 'CAT', 기타: 'OTHER' }; // `DOG`, `CAT`, `OTHER`

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

  const handleSubmit = async () => {
    try {
      // genderMap을 통해 결합된 성별 + 중성화 여부 처리
      const genderValue = genderMap[gender];
      const typeValue = typeMap[type]; // type도 변환
      console.log('type', type);
      const petRequest = {
        name,
        age: parseInt(age),
        gender: genderValue, // 변환된 gender 값
        species: typeValue, // 변환된 type 값
        weight: parseFloat(weight),
      };

      console.log('Pet Request:', petRequest); // 요청 값 확인

      await registerPet({ petRequest, photo: image }); // ✅ API 호출
      alert('등록되었습니다');
      navigate(-1);
    } catch (err) {
      console.error('❌ 등록 실패:', err);
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
            className="text-white bg-green-300 px-4 py-1 rounded-xl h5"
            onClick={handleImageUpload} // 사진 등록 버튼 클릭 시 파일 선택 창 열기
          >
            사진 등록
          </button>
          <button
            className="text-gray-400 bg-gray-100 px-4 py-1 rounded-xl h5"
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
            <Input id="age" label="나이" placeholder="0" value={age} onChange={(e) => setAge(e.target.value)} />
            <Input
              id="weight"
              label="체중(kg)"
              placeholder="0.0"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
          </div>

          <div className="flex gap-4">
            <div className="flex flex-col w-full">
              <label htmlFor="gender" className="h4 mb-2 text-black">
                성별
              </label>
              <SelectionDropdown
                id="gender"
                options={genderOptions}
                placeholder="성별을 선택해주세요"
                value={gender}
                onChange={setGender}
                activeId={activeDropdownId}
                setActiveId={setActiveDropdownId}
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label htmlFor="type" className="h4 mb-2 text-black">
              종
            </label>
            <SelectionDropdown
              id="type"
              options={typeOptions}
              placeholder="반려동물 종을 선택해주세요"
              value={type}
              onChange={setType}
              activeId={activeDropdownId}
              setActiveId={setActiveDropdownId}
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
