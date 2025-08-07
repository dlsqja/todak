// 주소 : owner/pet/register

import '@/styles/main.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import BackHeader from '@/component/header/BackHeader';
import ImageInputBox from '@/component/input/ImageInputBox';
import Input from '@/component/input/Input';
import Button from '@/component/button/Button';

import { registerPet } from '@/services/api/Owner/ownerpet'; // ✅ API import

export default function OwnerPetRegister() {
  const navigate = useNavigate();

  const [image, setImage] = useState(null); // ✅ string → File(null 가능)
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState(''); // 아직 사용되지 않지만 보존
  const [gender, setGender] = useState('');
  const [neutered, setNeutered] = useState(''); // 아직 사용되지 않지만 보존
  const [type, setType] = useState('');

  // ✅ gender / species enum 변환
  const genderMap = { 남: 'MALE', 여: 'FEMALE', '': 'NON' };
  const typeMap = { 강아지: 'DOG', 고양이: 'CAT', 기타: 'OTHER' };

  const handleSubmit = async () => {
    try {
      const petRequest = {
        name,
        age: parseInt(age),
        gender: genderMap[gender],
        species: typeMap[type],
      };

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
          <ImageInputBox src={image} onChange={(newImg) => setImage(newImg)} />
          <button
            className="text-white bg-green-300 px-4 py-1 rounded-xl h5"
            onClick={() => alert('사진 등록 기능은 ImageInputBox에서 처리됩니다.')}
          >
            사진 등록
          </button>
          <button
            className="text-gray-400 bg-gray-100 px-4 py-1 rounded-xl h5"
            onClick={() => setImage(null)}
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
              <label htmlFor="gender" className="h4 mb-2 text-black">
                성별
              </label>
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
              <label htmlFor="neutered" className="h4 mb-2 text-black">
                중성화 여부
              </label>
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
            <label htmlFor="type" className="h4 mb-2 text-black">
              종
            </label>
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

        {/* 등록 버튼 */}
        <div className="mt-6">
          <Button text="반려동물 등록하기" color="green" onClick={handleSubmit} />
        </div>
      </div>
    </div>
  );
}
