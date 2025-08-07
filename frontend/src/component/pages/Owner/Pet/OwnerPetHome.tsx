import '@/styles/main.css';

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { petMockList } from './petMockList';

import SimpleHeader from '@/component/header/SimpleHeader';
import ImageInputBox from '@/component/input/ImageInputBox';
import TabGroupPet from '@/component/navbar/TabGroupPet';
import OwnerPetTabInfo from './OwnerPetTabInfo';
import OwnerPetTabRecord from './OwnerPetTabRecord';

export default function OwnerPetHome() {
  const navigate = useNavigate();
  const [pets, setPets] = useState(petMockList);
  const [selectedPet, setSelectedPet] = useState(petMockList[0]);
  const [selectedTab, setSelectedTab] = useState('상세 정보');

  const handleRegister = () => {
    navigate('/owner/pet/register');
  };

  return (
    <div className="pb-20">
      <SimpleHeader text="반려동물 관리" />
      <div className="px-7 space-y-6 pt-6">
        {/* 1. 반려동물 이미지 리스트 */}
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
          {/* 등록 버튼 */}
          <div className="flex flex-col items-center cursor-pointer" onClick={handleRegister}>
            <ImageInputBox />
            <p className="caption mt-2">동물 등록</p>
          </div>
        </div>

        {/* 2. 탭 메뉴 */}
        <TabGroupPet selected={selectedTab} onSelect={setSelectedTab} />

        {/* 3. 탭 콘텐츠 */}
        {selectedTab === '상세 정보' && selectedPet && (
          <OwnerPetTabInfo selectedPet={selectedPet} setPets={setPets} setSelectedPet={setSelectedPet} />
        )}
        {selectedTab === '진료 내역' && (
          <OwnerPetTabRecord selectedPet={selectedPet} />
        )}
      </div>
    </div>
  );
}
