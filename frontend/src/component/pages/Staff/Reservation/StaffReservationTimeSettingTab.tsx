import React, { useEffect, useState } from 'react';
import SimpleHeader from '@/component/header/SimpleHeader';
import FilterDropdown from '@/component/selection/FilterDropdown';
import ClosingTimeSelectionButton from '@/component/selection/ClosingTimeSelectionButton';
import Button from '@/component/button/Button';

interface Vet {
  vetId: number;
  name: string;
  profile: string;
  photo: string;
}

export default function StaffReservationTimeSettingTab() {
  const [vets, setVets] = useState<Vet[]>([]);
  const [selectedVetId, setSelectedVetId] = useState<string>('all');
  const [disabledTimes, setDisabledTimes] = useState<string[]>([]);

  const dummyVets: Vet[] = [
    { vetId: 1, name: '김수의', profile: '내과', photo: 'https://via.placeholder.com/100' },
    { vetId: 2, name: '박치료', profile: '외과', photo: '' },
  ];

  useEffect(() => {
    setVets(dummyVets);
  }, []);

  const dropdownOptions = [
    { value: 'all', label: '전체 수의사' },
    ...vets.map((vet) => ({
      value: String(vet.vetId),
      label: vet.name,
      description: vet.profile,
      photo: vet.photo || undefined,
    })),
  ];

  const handleRegister = () => {
    console.log('예약 불가 시간 등록 요청!!!');
    console.log('선택된 수의사:', selectedVetId);
    console.log('예약 불가 시간:', disabledTimes);
    // ✨ 여기에 캐시나 서버로 전송 로직 연결 예정
  };

  return (
    <div className="space-y-6">

      <FilterDropdown
        options={dropdownOptions}
        value={selectedVetId}
        onChange={setSelectedVetId}
        placeholder="전체 수의사"
      />

      <ClosingTimeSelectionButton
        vetId={selectedVetId}
        startTime="09:00"
        endTime="18:00"
        disabledTimes={disabledTimes}
        setDisabledTimes={setDisabledTimes}
      />

      <div className="pt-6">
        <Button onClick={handleRegister} text="등록하기" color='green' />
      </div>
    </div>
  );
}
