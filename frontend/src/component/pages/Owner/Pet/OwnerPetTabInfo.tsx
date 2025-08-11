// src/component/pages/Owner/Pet/OwnerPetTabInfo.tsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { deletePet } from '@/services/api/Owner/ownerpet';

import Button from '@/component/button/Button';
import CopyButton from '@/component/button/CopyButton';

export default function OwnerPetTabInfo({ selectedPet, setSelectedPet, pets, setPets, onDelete  }) {
  const navigate = useNavigate();

  // 반려동물 삭제
  const handleDelete = async () => {
    const confirmDelete = window.confirm(`정말 삭제할까요?`);
    if (confirmDelete) {
      onDelete(selectedPet.petId);
      try {
        const response = await deletePet(selectedPet.petId);  // 서버에 삭제 요청
        if (response.status === 200) {
          const updatedPets = pets.filter((pet) => pet.petId !== selectedPet.petId);
          // pets 상태를 업데이트
          setPets(updatedPets);
          // selectedPet도 null로 설정 (선택된 반려동물이 없어야 하므로)
          setSelectedPet(null);
          // 삭제 후 페이지 리디렉션
          navigate('/owner/pet'); // 삭제 후 다시 /owner/pet 페이지로 이동
        }
      } catch (err) {
        console.error('삭제 실패:', err);
        alert('삭제에 실패했습니다. 다시 시도해주세요.');
      }
    }
  };

  const handleEdit = () => {
    navigate(`/owner/pet/edit/${selectedPet.petId}`, {
      state: { pet: selectedPet }, 
    });
  };

  console.log(selectedPet);
  console.log(Object.keys(selectedPet));

  return (
    <>
      <div className="space-y-3 bg-white p-4">
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
          <p className="p">
            {selectedPet?.gender === 'MALE' ? '남'
            : selectedPet?.gender === 'FEMALE' ? '여'
            : selectedPet?.gender === 'MALE_NEUTERING' ? '남(중성화)'
            : selectedPet?.gender === 'FEMALE_NEUTERING' ? '여(중성화)'
            : selectedPet?.gender === 'NON' ? '성별없음' : ''}
          </p>
        </div>
        <div className="flex justify-between">
          <p className="p text-brown-300">체중</p>
          <p className="p">{selectedPet.weight}kg</p>

        </div>
        <div className="flex justify-between">
          <p className="p text-brown-300">동물 종류</p>
          <p className="p">
            {selectedPet?.species === 'DOG' ? '강아지'
            : selectedPet?.species === 'CAT' ? '고양이'
            : '미선택'}
           </p>
        </div>
        <div className="flex justify-between items-center">
          <p className="p text-brown-300">등록 코드</p>
          <div className="flex items-center gap-2">
            <p className="p">{selectedPet.pet_code}</p>
            <CopyButton />
          </div>
        </div>
      </div>

      {/* 버튼들 */}
      <div className="flex gap-3">
        <Button text="동물 삭제하기" color="green" className="h4" onClick={handleDelete} />
        <Button text="상세 정보 수정하기" color="green" className="h4 text-white" onClick={handleEdit} />
      </div>
    </>
  );
}
