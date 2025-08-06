import React, { useEffect, useState } from 'react';
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

export default function ReservationTab() {
  const [vets, setVets] = useState<Vet[]>([]);
  const [reservationData, setReservationData] = useState<ReservationData[]>([]);
  const [selectedVetId, setSelectedVetId] = useState<string>('all');
  const navigate = useNavigate();

  const dummyVets: Vet[] = [
    { vetId: 1, name: '김수의', profile: '내과', photo: 'https://via.placeholder.com/100' },
    { vetId: 2, name: '박치료', profile: '외과', photo: '' },
  ];

  const dummyReservations: { vetId: number; time: string; pet: string; owner: string }[] = [
    { vetId: 1, time: '10:00', pet: '초코', owner: '홍길동' },
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

  const handleRowClick = (record: {
    time: string;
    doctor: string;
    pet: string;
    owner: string;
  }) => {
    // ✅ 상세 페이지로 이동할 때 쿼리 or 파라미터 전송
    navigate(`/staff/reservation/detail`, { state: record });

  };

  return (
    <div className="space-y-6">
      <FilterDropdown
        options={dropdownOptions}
        value={selectedVetId}
        onChange={setSelectedVetId}
        placeholder="전체 수의사"
      />

      {reservationData.length > 0 ? (
        <>
          <div className="grid grid-cols-4 px-3 mb-4">
            <p className='h4'>진료 시간</p>
            <p className='h4 text-center'>수의사</p>
            <p className='h4 text-center'>진료 대상</p>
            <p className='h4 text-center'>보호자</p>
          </div>
          <ReservationTimeTable data={reservationData} onRowClick={handleRowClick} />
        </>
      ) : (
        <div className="flex flex-grow items-center justify-center min-h-[200px]">
          <p className="p">예약 내역이 없습니다</p>
        </div>
      )}
    </div>
  );
}
