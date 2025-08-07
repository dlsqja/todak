import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/component/button/Button';
import CopyButton from '@/component/button/CopyButton';
import { useNavigate } from 'react-router-dom';

export default function OwnerPetTabInfo({ selectedPet, setPets, setSelectedPet }) {
  const navigate = useNavigate();

  const handleDelete = () => {
    const confirmDelete = window.confirm(`정말 삭제할까요?`);
    if (confirmDelete) {
      const updated = (prev) => prev.filter((pet) => pet.id !== selectedPet.id);
      setPets(updated);
      setSelectedPet(null); // 이전 값 참조 필요 없음
    }
  };
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/owner/pet/edit/${selectedPet.petId}`, {
  state: { pet: selectedPet }, 
});
  };

  return (
    <>
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
          <p className="p">{selectedPet.species}</p>
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
