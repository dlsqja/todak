// 주소 : owner/pet

import '@/styles/main.css';

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { petMockList } from './petMockList.js';
import ImageInputBox from '@/component/input/ImageInputBox';
import TabGroupPet from '@/component/navbar/TabGroupPet';
import Button from '@/component/button/Button';

export default function OwnerPetHome() {
  const navigate = useNavigate();
  const [pets, setPets] = useState(petMockList);                  // 반려동물 전체 목록
  const [selectedPet, setSelectedPet] = useState(petMockList[0]); // 선택된 반려동물
  const [selectedTab, setSelectedTab] = useState('상세 정보');     // 현재 탭

  const handleRegister = () => {
    navigate('/owner/pet/register');
  };

  const handleEdit = () => {
    navigate(`/owner/pet/edit/${selectedPet.id}`);
  };

  const handleDelete = () => {
    const confirmDelete = window.confirm(`${selectedPet.name}을 정말 삭제할까요?`);
    if (confirmDelete) {
      setPets(pets.filter((pet) => pet.id !== selectedPet.id));
      setSelectedPet(pets[0]);
    }
  };

  return (
    <div className="p-4 space-y-6">

      {/* 1. 이미지 박스 리스트 */}
      <div className="flex gap-4 overflow-x-auto">
        {pets.map((pet) => (
          <div key={pet.id} className="flex flex-col items-center cursor-pointer" onClick={() => setSelectedPet(pet)}>
            <ImageInputBox
              src={pet.image}
              stroke={pet.id === selectedPet?.id ? 'outline outline-gray-700 outline-2' : ''}
            />
            <p className="caption mt-2">{pet.name}</p>
          </div>
        ))}

        {/* 1-1. 동물 등록 버튼 */}
        <div className="flex flex-col items-center cursor-pointer" onClick={handleRegister}>
          <ImageInputBox />
          <p className="caption mt-2">동물 등록</p>
        </div>
      </div>

      {/* 2. 탭 그룹 */}
      <TabGroupPet selected={selectedTab} onSelect={setSelectedTab} />

      {/* 3. 상세 정보 or 진료 내역 */}
      {selectedTab === '상세 정보' && selectedPet && (
        <div className="space-y-2 bg-white p-4 rounded-xl shadow">
          <p className="p">이름: {selectedPet.name}</p>
          <p className="p">나이: {selectedPet.age}세</p>
          <p className="p">성별: {selectedPet.gender}</p>
          <p className="p">종류: {selectedPet.type}</p>
          <p className="p">등록 코드: {selectedPet.code}</p>
        </div>
      )}

      {/* 4. 삭제 / 수정 버튼 */}
      <div className="space-y-3">
        <Button text="동물 삭제하기" color="gray" className="h4" onClick={handleDelete} />
        <Button text="상세 정보 수정하기" color="black" className="h4 text-white" onClick={handleEdit} />
      </div>
    </div>
  );
}
