import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import BackHeader from '@/component/header/BackHeader';
import SearchInput from '@/component/input/SearchInput';
import SearchListItem from '@/component/card/SearchListItem';
import { getVetsByHospitalId } from '@/services/api/Owner/ownerhome';
import type { VetPublic } from '@/types/Owner/ownerhomeType';

export default function SelectVetPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const hospital = location.state?.hospital; // { hospitalId, name, location, ... }
  const pet = location.state?.pet;

  const [search, setSearch] = useState('');
  const [vets, setVets] = useState<VetPublic[]>([]);

  useEffect(() => {
    if (!hospital?.hospitalId) return;
    (async () => {
      try {
        const list = await getVetsByHospitalId(Number(hospital.hospitalId));
        setVets(list);
      } catch (e) {
        console.warn('수의사 리스트 불러오기 실패:', e);
      }
    })();
  }, [hospital?.hospitalId]);

  const filtered = vets.filter(v =>
    !search.trim() || v.name.toLowerCase().includes(search.trim().toLowerCase())
  );

  return (
    <div className="min-h-screen pb-4">
      <BackHeader text="수의사 선택" />
      <div className="px-7 py-6">
        <p className="p text-black mb-4 text-center">{hospital?.name}의 수의사를 선택해주세요.</p>

        <SearchInput placeholder="수의사명" value={search} onChange={setSearch} />

        <div className="mt-8">
          <h4 className="p text-black mb-3">수의사 목록</h4>
          <div className="bg-green-100 rounded-xl overflow-hidden">
            {filtered.length === 0 && <div className="p-4 text-gray-400">수의사가 없습니다.</div>}
            {filtered.map(vet => (
              <SearchListItem
                key={vet.vetId}
                name={vet.name}
                description={vet.profile || '프로필 없음'}
                onClick={() => navigate('/owner/home/vet-info', { state: { hospital, pet, vet } })}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
