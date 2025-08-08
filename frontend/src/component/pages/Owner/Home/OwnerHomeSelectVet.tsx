import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import BackHeader from '@/component/header/BackHeader';
import SearchInput from '@/component/input/SearchInput';
import SearchListItem from '@/component/card/SearchListItem';
import { getVetsByHospitalId } from '@/services/api/Owner/ownerhome';
import type { VetPublic, WorkingHourResponse } from '@/types/Owner/ownerhomeType';
import { timeMapping } from '@/utils/timeMapping';

const dayIdxToCode: ('SUN'|'MON'|'TUE'|'WED'|'THU'|'FRI'|'SAT')[] =
  ['SUN','MON','TUE','WED','THU','FRI','SAT'];
const dayCodeToKo: Record<string,string> = {
  SUN:'일', MON:'월', TUE:'화', WED:'수', THU:'목', FRI:'금', SAT:'토'
};

export default function SelectVetPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const hospital = location.state?.hospital;
  const pet = location.state?.pet;

  const [search, setSearch] = useState('');
  const [vets, setVets] = useState<VetPublic[]>([]);

  // 병원 수의사 목록 (+ 근무시간 포함)
  useEffect(() => {
    if (!hospital?.hospitalId) return;
    (async () => {
      try {
        const list = await getVetsByHospitalId(Number(hospital.hospitalId));
        setVets(list ?? []);
      } catch (e) {
        console.warn('수의사 리스트 불러오기 실패:', e);
        setVets([]);
      }
    })();
  }, [hospital?.hospitalId]);

  // 오늘 요일
  const todayCode = useMemo(() => dayIdxToCode[new Date().getDay()], []);
  const todayKo = dayCodeToKo[todayCode];

  // 오늘 근무시간 표시 (각 vet 객체에 포함된 workingHours 사용)
  const renderTodayWork = (wh?: WorkingHourResponse[]) => {
    if (!wh || wh.length === 0) return `(${todayKo}) 근무정보 없음`;
    const today = wh.find(w => w.day === todayCode);
    if (!today) return `(${todayKo}) 근무정보 없음`;

    const start = timeMapping[today.startTime] ?? '';
    const end = timeMapping[today.endTime] ?? '';
    return (start && end)
      ? `(${todayKo}) ${start}~${end}`
      : `(${todayKo}) 근무정보 없음`;
  };

  const filtered = vets.filter(v =>
    !search.trim() || v.name.toLowerCase().includes(search.trim().toLowerCase())
  );

  return (
    <div className="min-h-screen pb-4">
      <BackHeader text="수의사 선택" />
      <div className="px-7 py-6">
        <p className="p text-black mb-4 text-center">
          {hospital?.name}의 수의사를 선택해주세요.
        </p>

        <SearchInput placeholder="수의사명" value={search} onChange={setSearch} />

        <div className="mt-8">
          <h4 className="p text-black mb-3">수의사 목록</h4>
          <div className="bg-green-100 rounded-xl overflow-hidden">
            {filtered.length === 0 && (
              <div className="p-4 text-gray-400">수의사가 없습니다.</div>
            )}

            {filtered.map(vet => (
              <SearchListItem
                key={vet.vetId}
                name={vet.name}
                description={renderTodayWork(vet.workingHours)}
                onClick={() =>
                  navigate('/owner/home/vet-info', { state: { hospital, pet, vet } })
                }
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
