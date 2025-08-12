// src/component/pages/Owner/Pet/OwnerPetTabInfo.tsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { deletePet } from '@/services/api/Owner/ownerpet';

import Button from '@/component/button/Button';
import CopyButton from '@/component/button/CopyButton';

export default function OwnerPetTabInfo({ selectedPet, setSelectedPet, pets, setPets, onDelete }) {
  const navigate = useNavigate();

  // 반려동물 삭제
  const handleDelete = async () => {
    const confirmDelete = window.confirm(`정말 삭제할까요?`);
    if (confirmDelete) {
      try {
        console.log('삭제 시작:', selectedPet.petId);
        const response = await deletePet(selectedPet.petId); // 서버에 삭제 요청
        console.log('API 응답:', response);

        // API 성공 시에만 상태 업데이트
        if (response && (response.status === 200 || response.data)) {
          console.log('삭제 성공, 상태 업데이트 시작');

          // 부모 컴포넌트의 onDelete 호출
          onDelete(selectedPet.petId);

          // 로컬 상태도 업데이트
          const updatedPets = pets.filter((pet) => pet.petId !== selectedPet.petId);
          setPets(updatedPets);
          setSelectedPet(updatedPets[0] || null); // 첫 번째 펫 선택 또는 null

          alert('삭제되었습니다.');
          // 삭제 후 페이지 새로고침 또는 리디렉션
          window.location.reload();
        } else {
          throw new Error('삭제 응답이 올바르지 않습니다');
        }
      } catch (err) {
        console.error('삭제 실패:', err);
        alert('삭제에 실패했습니다. 다시 시도해주세요.');
      }
    }
  };

  // 상세 정보 수정하기 페이지 이동
  const handleEdit = () => {
    navigate(`/owner/pet/edit/${selectedPet.petId}`, {
      state: { pet: selectedPet },
    });
  };

  console.log(selectedPet);
  console.log(Object.keys(selectedPet));

  return (
    <>
      <div className="space-y-3 bg-white p-4 rounded-2xl shadow-[0px_5px_15px_rgba(0,0,0,0.08)]">
        <div className="flex justify-between ">
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
            {selectedPet?.gender === 'MALE'
              ? '남'
              : selectedPet?.gender === 'FEMALE'
              ? '여'
              : selectedPet?.gender === 'MALE_NEUTERING'
              ? '남(중성화)'
              : selectedPet?.gender === 'FEMALE_NEUTERING'
              ? '여(중성화)'
              : selectedPet?.gender === 'NON'
              ? '성별없음'
              : ''}
          </p>
        </div>
        <div className="flex justify-between">
          <p className="p text-brown-300">체중</p>
          <p className="p">{selectedPet.weight}kg</p>
        </div>
        <div className="flex justify-between">
          <p className="p text-brown-300">동물 종류</p>
          <p className="p">
            {selectedPet?.species === 'DOG' ? '강아지' : selectedPet?.species === 'CAT' ? '고양이' : '미선택'}
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
      <div className="flex gap-3 mt-5">
        <Button text="동물 삭제하기" color="gray" onClick={handleDelete} />
        <Button text="상세 정보 수정하기" color="green" className="h4 text-white" onClick={handleEdit} />
      </div>
    </>
  );
}
