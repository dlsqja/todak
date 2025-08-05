// 주소 : owner/pet/edit/{id}


import '@/styles/main.css';
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import BackHeader from '@/component/header/BackHeader';
import ImageInputBox from '@/component/input/ImageInputBox';
import Input from '@/component/input/input';
import Button from '@/component/button/Button';
import { petMockList } from './petMockList';

export default function OwnerPetEdit() {
  const navigate = useNavigate();
  const { id } = useParams(); // URL 파라미터에서 ID 추출

  const selectedPet = petMockList.find((pet) => String(pet.id) === id);

  const [image, setImage] = useState(selectedPet?.image || '');
  const [name, setName] = useState(selectedPet?.name || '');
  const [age, setAge] = useState(String(selectedPet?.age || ''));
  const [weight, setWeight] = useState(selectedPet?.weight || '');
  const [gender, setGender] = useState(selectedPet?.gender || '');
  const [neutered, setNeutered] = useState(selectedPet?.neutered || '');
  const [type, setType] = useState(selectedPet?.type || '');

  const handleSubmit = () => {
    alert('수정되었습니다');
    navigate(-1);
  };

  if (!selectedPet) {
    return <div className="p">존재하지 않는 반려동물입니다.</div>;
  }

  return (
    <div className="p-4 pt-4 pb-20 px-5 space-y-6">
      <BackHeader text="반려동물 수정" />

      {/* 이미지 등록 */}
      <div className="flex flex-col items-center space-y-2">
        <ImageInputBox src={image} onChange={(newImg) => setImage(newImg)} />
        <button className="text-white bg-gray-800 px-4 py-1 rounded-xl h5">사진 등록</button>
        <button className="text-gray-400 bg-gray-100 px-4 py-1 rounded-xl h5">사진 제거</button>
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
            onChange={(e) => setAge(e.target.value)}
          />
          <Input
            id="weight"
            label="무게"
            placeholder="0"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
        </div>

        <div className="flex gap-4">
          <div className="flex flex-col w-full">
            <label htmlFor="gender" className="h4 mb-2 text-black">성별</label>
            <select
              id="gender"
              className="w-full h-12 rounded-[12px] border border-gray-400 px-4 p text-black"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="">선택</option>
              <option value="남">남</option>
              <option value="여">여</option>
            </select>
          </div>
          <div className="flex flex-col w-full">
            <label htmlFor="neutered" className="h4 mb-2 text-black">중성화 여부</label>
            <select
              id="neutered"
              className="w-full h-12 rounded-[12px] border border-gray-400 px-4 p text-black"
              value={neutered}
              onChange={(e) => setNeutered(e.target.value)}
            >
              <option value="">선택</option>
              <option value="예">예</option>
              <option value="아니오">아니오</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col">
          <label htmlFor="type" className="h4 mb-2 text-black">종</label>
          <select
            id="type"
            className="w-full h-12 rounded-[12px] border border-gray-400 px-4 p text-black"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="">반려동물 종을 선택해주세요</option>
            <option value="강아지">강아지</option>
            <option value="고양이">고양이</option>
            <option value="기타">기타</option>
          </select>
        </div>
      </div>

      {/* 수정 완료 버튼 */}
      <div className="mt-6">
        <Button text="수정 완료하기" color="green" onClick={handleSubmit} />
      </div>
    </div>
  );
}

