// 주소 : owner/pet/edit/{id}

import '@/styles/main.css';
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import BackHeader from '@/component/header/BackHeader';
import ImageInputBox from '@/component/input/ImageInputBox';
import Input from '@/component/input/Input';
import Button from '@/component/button/Button';
import SelectionDropdown from '@/component/selection/SelectionDropdown';

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
    <div className="pb-20 space-y-6">
      <BackHeader text="반려동물 수정" />
      <div className='px-7'>
      {/* 이미지 등록 */}
      <div className="flex flex-col items-center space-y-2 pb-6">
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
          <Input id="age" label="나이" placeholder="0" value={age} onChange={(e) => setAge(e.target.value)} />
          <Input id="weight" label="무게" placeholder="0" value={weight} onChange={(e) => setWeight(e.target.value)} />
        </div>

        {/* 성별 선택 */}
        <div className="flex gap-4">
          <div className="flex flex-col w-full">
          <label htmlFor="gender" className="h4 mb-2 text-black">성별</label>
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
            <label htmlFor="neutered" className="h4 mb-2 text-black">중성화 여부</label>
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
          <label htmlFor="type" className="h4 mb-2 text-black">종</label>
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
