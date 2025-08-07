import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import BackHeader from '@/component/header/BackHeader';
import SearchInput from '@/component/input/SearchInput';
import SearchListItem from '@/component/card/SearchListItem';

export default function SelectVetPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const hospital = location.state?.hospital;
  const pet = location.state?.pet;

  const [search, setSearch] = useState('');

  // ⚠️ 실제로는 hospital.id 로 해당 병원 수의사 목록 API 호출!
  const vetList = [
    { id: 1, name: '수의사 이름 1', day: '금', time: '09:00~18:00' },
    { id: 2, name: '수의사 이름 2', day: '월', time: '09:00~11:00' },
    { id: 3, name: '수의사 이름 3', day: '금', time: '09:00~18:00' },
  ];

  return (
    <div className="min-h-screen pb-4">
      <BackHeader text="수의사 선택" />

      <div className="px-7 py-6">
        <p className="p text-black mb-4 text-center">진료 받을 수의사를 선택해주세요.</p>

        <SearchInput
          placeholder="수의사명"
          value={search}
          onChange={setSearch}
        />

        <div className="mt-8">
          <h4 className="p text-black mb-3">최근 방문한 병원</h4>
          <div className="bg-white rounded-xl overflow-hidden">
            {vetList.map((vet) => (
              <SearchListItem
                key={vet.id}
                name={vet.name}
                description={`(${vet.day}) ${vet.time}`}
                onClick={() => {
                  navigate('/owner/home/vet-info', {
                    state: { hospital, pet, vet },
                  });
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
