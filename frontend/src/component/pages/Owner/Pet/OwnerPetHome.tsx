// 주소 : owner/pet

import '@/styles/main.css';

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { petMockList } from './petMockList';
import SimpleHeader from '@/component/header/SimpleHeader';
import ImageInputBox from '@/component/input/ImageInputBox';
import TabGroupPet from '@/component/navbar/TabGroupPet';
import Button from '@/component/button/Button';
import CopyButton from '@/component/button/CopyButton';

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
      const updatedPets = pets.filter((pet) => pet.id !== selectedPet.id);
      setPets(updatedPets);
      setSelectedPet(updatedPets[0] || null);
    }
  };

  return (
    <div className="pb-20">
      <SimpleHeader text="반려동물 관리" />
      <div className='px-7 space-y-6 pt-6'>
      {/* 1. 이미지 박스 리스트 */}
      <div className="flex justify-center gap-4 overflow-x-auto">
        {pets.map((pet) => (
          <div key={pet.id} className="flex flex-col items-center cursor-pointer" onClick={() => setSelectedPet(pet)}>
            <ImageInputBox
              src={pet.image}
              stroke={pet.id === selectedPet?.id ? 'border-2 border-pink-200' : ''}
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
        <div className="space-y-3 bg-green-100 p-4">
          <div className="flex justify-between">
            <p className="p text-brown-300">이름</p>
            <p className="p">{selectedPet.name}</p>
          </div>
          <div className="flex justify-between">
            <p className="p text-brown-300">나이</p>
            <p className="p">{selectedPet.age}세</p>
          </div>
          <div className="flex justify-between">
            <p className="p text-brown-300">성별</p>
            <p className="p">{selectedPet.gender}</p>
          </div>
          <div className="flex justify-between">
            <p className="p text-brown-300">동물 종류</p>
            <p className="p">{selectedPet.type}</p>
          </div>
          <div className="flex justify-between items-center">
            <p className="p text-brown-300">등록 코드</p>
            <div className="flex items-center gap-2">
              <p className="p">{selectedPet.code}</p>
              <CopyButton />
            </div>
          </div>
        </div>
      )}

      {/* 4. 삭제 / 수정 버튼 */}
      {selectedTab === '상세 정보' && (
        <>
          <div className="space-y-3">
            <Button text="동물 삭제하기" color="green" className="h4" onClick={handleDelete} />
          </div>
          <div className="space-y-3">
            <Button text="상세 정보 수정하기" color="green" className="h4 text-white" onClick={handleEdit} />
          </div>
        </>
      )}
    </div>
    </div>
  );
}
