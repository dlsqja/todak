// 주소 : owner/pet/edit/{id}

import '@/styles/main.css';
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import BackHeader from '@/component/header/BackHeader';
import ImageInputBox from '@/component/input/ImageInputBox';
import Input from '@/component/input/Input';
import Button from '@/component/button/Button';
import SelectionDropdown from '@/component/selection/SelectionDropdown';

import { petMockList } from './petMockList';

export default function OwnerPetEdit() {
  const DEFAULT_IMAGE = '/images/pet_default.png';
  const navigate = useNavigate();
  const { id } = useParams(); // URL 파라미터에서 ID 추출
  const selectedPet = petMockList.find((pet) => String(pet.id) === id);
  const [selectedImage, setSelectedImage] = useState<string>(selectedPet?.image || DEFAULT_IMAGE); // 기본 이미지
  const [isDefaultImage, setIsDefaultImage] = useState<boolean>(
    !selectedPet?.image || selectedPet?.image === DEFAULT_IMAGE,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(selectedPet?.name || '');
  const [age, setAge] = useState(String(selectedPet?.age || ''));
  const [weight, setWeight] = useState(selectedPet?.weight || '');
  const [gender, setGender] = useState(selectedPet?.gender || '');
  const [neutered, setNeutered] = useState(selectedPet?.neutered || '');
  const [type, setType] = useState(selectedPet?.type || '');

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl); // 새 파일로 교체
      setIsDefaultImage(false); // 기본 이미지가 아님
    }
    // 파일 input 초기화 (같은 파일을 다시 선택할 수 있도록)
    if (event.target) {
      event.target.value = '';
    }
  };

  // 이미지 파일 선택
  const handleImageUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // 이미지 제거
  const handleRemoveImage = () => {
    if (window.confirm('사진을 제거하시겠습니까?')) {
      setSelectedImage(DEFAULT_IMAGE);
      setIsDefaultImage(true); // 기본 이미지로 설정
    }
  };

  const handleSubmit = () => {
    alert('수정되었습니다');
    navigate(`/owner/pet/`);
  };

  if (!selectedPet) {
    return <div className="p">존재하지 않는 반려동물입니다.</div>;
  }

  return (
    <div className="pb-20 space-y-6">
      <BackHeader text="반려동물 수정" />
      <div className="px-7 space-y-6">
        {/* 이미지 등록 */}
        <div className="flex justify-center gap-3">
          <ImageInputBox src={selectedImage} stroke={isDefaultImage ? 'border-pink-100' : 'border-green-100'} />
          <input type="file" ref={fileInputRef} onChange={handleImageSelect} accept="image/*" className="hidden" />
          <div className="pt-4">
            <button
              className="w-full h-6 rounded-[12px] h5 bg-green-300 text-green-100 cursor-pointer"
              onClick={handleImageUpload}
            >
              사진 등록
            </button>
            <button
              className="w-full h-6 rounded-[12px] h5 bg-gray-100 text-gray-500 cursor-pointer"
              onClick={handleRemoveImage}
            >
              사진 제거
            </button>
          </div>
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
              label="무게"
              placeholder="0"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
          </div>

          {/* 성별 선택 */}
          <div className="flex gap-4">
            <div className="flex flex-col w-full">
              <label htmlFor="gender" className="h4 mb-2 text-black">
                성별
              </label>
              <SelectionDropdown
                value={gender}
                onChange={(val) => setGender(val)}
                options={[
                  { value: '남', label: '남' },
                  { value: '여', label: '여' },
                ]}
                placeholder="성별을 선택해주세요"
              />
            </div>

            {/* 중성화 여부 선택 */}
            <div className="flex flex-col w-full">
              <label htmlFor="neutered" className="h4 mb-2 text-black">
                중성화 여부
              </label>
              <SelectionDropdown
                value={neutered}
                onChange={(val) => setNeutered(val)}
                options={[
                  { value: '예', label: '예' },
                  { value: '아니오', label: '아니오' },
                ]}
                placeholder="중성화 여부 선택"
              />
            </div>
          </div>

          {/* 종 선택 */}
          <div className="flex flex-col">
            <label htmlFor="type" className="h4 mb-2 text-black">
              종
            </label>
            <SelectionDropdown
              value={type}
              onChange={(val) => setType(val)}
              options={[
                { value: '강아지', label: '강아지' },
                { value: '고양이', label: '고양이' },
                { value: '기타', label: '기타' },
              ]}
              placeholder="반려동물 종을 선택해주세요"
            />
          </div>
        </div>

        {/* 수정 완료 버튼 */}
        <div className="mt-6">
          <Button text="수정 완료하기" color="green" onClick={handleSubmit} />
        </div>
      </div>
    </div>
  );
}
