import React from 'react';
import Button from '@/component/button/Button';
import CopyButton from '@/component/button/CopyButton';

export default function OwnerPetTabInfo({ selectedPet, setPets, setSelectedPet }) {
  const handleDelete = () => {
    const confirmDelete = window.confirm(`${selectedPet.name}을 정말 삭제할까요?`);
    if (confirmDelete) {
      const updated = (prev) => prev.filter((pet) => pet.id !== selectedPet.id);
      setPets(updated);
      setSelectedPet((prev) => null);
    }
  };

  const handleEdit = () => {
    window.location.href = `/owner/pet/edit/${selectedPet.id}`;
  };

  return (
    <>
      <div className="space-y-3 bg-green-100 p-4">
        <div className="flex justify-between"><p className="p text-brown-300">이름</p><p className="p">{selectedPet.name}</p></div>
        <div className="flex justify-between"><p className="p text-brown-300">나이</p><p className="p">{selectedPet.age}세</p></div>
        <div className="flex justify-between"><p className="p text-brown-300">성별</p><p className="p">{selectedPet.gender}</p></div>
        <div className="flex justify-between"><p className="p text-brown-300">동물 종류</p><p className="p">{selectedPet.type}</p></div>
        <div className="flex justify-between items-center">
          <p className="p text-brown-300">등록 코드</p>
          <div className="flex items-center gap-2">
            <p className="p">{selectedPet.code}</p>
            <CopyButton />
          </div>
        </div>
      </div>

      {/* 버튼들 */}
      <div className="space-y-3">
        <Button text="동물 삭제하기" color="green" className="h4" onClick={handleDelete} />
        <Button text="상세 정보 수정하기" color="green" className="h4 text-white" onClick={handleEdit} />
      </div>
    </>
  );
}
