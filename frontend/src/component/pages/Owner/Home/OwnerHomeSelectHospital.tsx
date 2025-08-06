import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import BackHeader from '@/component/header/BackHeader';
import SearchInput from '@/component/input/SearchInput';
import SearchListItem from '@/component/card/SearchListItem';

export default function SelectHospitalPage() {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const pet = location.state?.pet;

  const recentHospitals = [
    { id: 1, name: '병원 이름 1', desc: '서울시 강남구 강남대로 123' },
    { id: 2, name: '병원 이름 2', desc: '서울시 강남구 강남대로 124' },
    { id: 3, name: '병원 이름 3', desc: '서울시 강남구 강남대로 126' },
  ];

  const searchResult = { id: 999, name: '검색한 병원 명', desc: '서울시 동대문구 답십리로 123' };

  /** 병원 클릭 시 공통 이동 로직 */
  const handleHospitalClick = (hospital: { id: number; name: string; desc: string }) => {
    navigate('/owner/home/vet', {
      state: { hospital, pet },
    });
  };

  return (
    <div className="min-h-screen pb-4">
      <BackHeader text="병원 선택" />

      <div className="px-7 py-6">
        <p className="p text-black mb-4 text-center">진료 받을 병원을 선택해주세요.</p>

        <SearchInput
          placeholder="병원명 혹은 병원 주소"
          value={search}
          onChange={setSearch}
        />

        <div className="mt-8">
          <h4 className="p text-black mb-3">최근 방문한 병원</h4>
          <div className="bg-green-100 rounded-xl overflow-hidden">
            {recentHospitals.map((hospital) => (
              <SearchListItem
                key={hospital.id}
                name={hospital.name}
                description={hospital.desc}
                onClick={() => handleHospitalClick(hospital)}
              />
            ))}
          </div>
        </div>

        <div className="mt-6">
          <h4 className="p text-black mb-3">검색 결과</h4>
          <div className="bg-green-100 rounded-xl overflow-hidden">
            <SearchListItem
              name={searchResult.name}
              description={searchResult.desc}
              onClick={() => handleHospitalClick(searchResult)} // 💥 검색 결과도 이동 가능하게!!!
            />
          </div>
        </div>
      </div>
    </div>
  );
}
