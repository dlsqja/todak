import React, { useEffect, useState } from 'react';
import SimpleHeader from '@/component/header/SimpleHeader';
import FilterDropdown from '@/component/selection/FilterDropdown';
import ReservationTimeTable from '@/component/table/ReservationTimeTable';
import { useNavigate } from 'react-router-dom';

interface Vet {
  vetId: number;
  name: string;
  profile: string;
  photo: string;
}

interface ReservationData {
  time: string;
  records: {
    doctor: string;
    pet: string;
    owner: string;
  }[];
}

export default function StaffReservation() {
  const [vets, setVets] = useState<Vet[]>([]);
  const [reservationData, setReservationData] = useState<ReservationData[]>([]);
  const [selectedVetId, setSelectedVetId] = useState<string>('all');

  const dummyVets: Vet[] = [
    { vetId: 1, name: '김수의', profile: '내과', photo: 'https://via.placeholder.com/100' },
    { vetId: 2, name: '박치료', profile: '외과', photo: '' },
  ];

  const dummyReservations: { vetId: number; time: string; pet: string; owner: string }[] = [
    { vetId: 1, time: '10:00', pet: '초코', owner: '홍길동' },
    // { vetId: 2, time: '10:00', pet: '나비', owner: '김영희' },
    { vetId: 1, time: '11:00', pet: '뽀삐', owner: '이철수' },
  ];

  useEffect(() => {
    setVets(dummyVets);
  }, []);

  useEffect(() => {
    const filtered = selectedVetId === 'all'
      ? dummyReservations
      : dummyReservations.filter(r => String(r.vetId) === selectedVetId);

    const grouped: { [time: string]: ReservationData['records'] } = {};
    filtered.forEach(({ time, pet, owner, vetId }) => {
      const doctor = dummyVets.find(v => v.vetId === vetId)?.name || '알 수 없음';
      if (!grouped[time]) grouped[time] = [];
      grouped[time].push({ doctor, pet, owner });
    });

    const result: ReservationData[] = Object.entries(grouped).map(([time, records]) => ({
      time,
      records,
    }));

    setReservationData(result);
  }, [selectedVetId]);

  const dropdownOptions = [
    { value: 'all', label: '전체 수의사' },
    ...vets.map((vet) => ({
      value: String(vet.vetId),
      label: vet.name,
      description: vet.profile,
      photo: vet.photo || undefined,
    })),
  ];

  return (
    <div className="pb-6">
  <SimpleHeader text="예약 신청 목록" />
 
  <div className="px-7 py-6 space-y-6">
    <FilterDropdown
      options={dropdownOptions}
      value={selectedVetId}
      onChange={setSelectedVetId}
      placeholder="전체 수의사"
    />

    {reservationData.length > 0 ? (
      <>
        {/* ✅ 테이블 칼럼 타이틀 */}
        <div className="grid grid-cols-4 px-3 mb-4">
          <p className='h4'>진료 시간</p>
          <p className='h4 text-center'>수의사</p>
          <p className='h4 text-center'>진료 대상</p>
          <p className='h4 text-center'>보호자</p>
        </div>

        {/* ✅ 예약 테이블 렌더 */}
        <ReservationTimeTable data={reservationData} />
      </>
    ) : (
      // ✅ 예약 내역이 없을 경우
      <div className="flex flex-grow items-center justify-center min-h-[200px]">
    <p className="p">예약 내역이 없습니다</p>
  </div>
    )}
  </div>
</div>

  );
}
