import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import '@/styles/main.css';
import PetProfileCard from '@/component/card/PetProfileCard';
import SearchInput from '@/component/input/SearchInput';

interface Pet {
  id: number;
  name: string;
  genderAge: string;
  breedAge: string;
  weight: string;
}

export default function OwnerHome() {
  const navigate = useNavigate();
  const [petList, setPetList] = useState<Pet[]>([]);

  useEffect(() => {
    // TODO: 실제 API 연결해야 함!! 여기선 mock 데이터 사용!!
    setPetList([
      { id: 1, name: '미료', genderAge: '여 (중성)', breedAge: '비숑 9세', weight: '4.1kg' },
      { id: 2, name: '콩이', genderAge: '남 (중성)', breedAge: '푸들 4세', weight: '3.5kg' },
      { id: 3, name: '망고', genderAge: '여 (중성)', breedAge: '말티즈 6세', weight: '2.8kg' },
    ]);
  }, []);

  /** 펫 클릭 시 병원 선택 페이지로 이동 (펫 정보 전달) */
  const handlePetClick = (pet: Pet) => {
    navigate('/owner/home/hospital', {
      state: { pet },
    });
  };

  return (
    <div>
      <h3 className="h3 mx-7 pt-13">ㅇㅇㅇ님 반가워요!</h3>
      <h3 className="h3 mx-7 mb-2">비대면 진료가 처음이신가요?</h3>

      <button
        onClick={() => navigate('/guide')}
        className="h5 mx-7 px-5 py-1 rounded-full inline-block bg-green-300 text-green-100 hover:bg-green-200 transition"
      >
        비대면 진료 가이드
      </button>

      <h3 className="mx-7 h3 mt-11">비대면 진료 시작하기</h3>

      {/* 🐶 펫 리스트 슬라이드 */}
      <div className="overflow-x-auto overflow-visible snap-x snap-mandatory scroll-smooth hide-scrollbar pt-3 pb-6">
        <div className="flex w-full h-full">
          {petList.map((pet) => (
            <div
              key={pet.id}
              className="w-full flex-shrink-0 snap-start overflow-visible px-7"
              onClick={() => handlePetClick(pet)} // 💥 클릭 시 병원 선택으로 이동!
            >
              <PetProfileCard name={pet.name} genderAge={pet.genderAge} breedAge={pet.breedAge} weight={pet.weight} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
