import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SelectionDropdown from '@/component/selection/SelectionDropdown';
import TreatmentRecordCard from '@/component/card/TreatmentRecordCard';
import { getReservations } from '@/services/api/Owner/ownerreservation';
import type { ReservationResponse } from '@/types/Owner/ownerreservationType';
import type { Pet } from '@/types/Owner/ownerpetType';

interface OwnerPetTabRecordProps {
  selectedPet: Pet;
}

export default function OwnerPetTabRecord({ selectedPet }: OwnerPetTabRecordProps) {
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [records, setRecords] = useState<ReservationResponse[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
  if (!selectedPet || !selectedPet.petId) return;

  const fetchData = async () => {
    try {
      const data = await getReservations();
      const filtered = data.filter((r) => r.pet?.petId === selectedPet.petId);
      setRecords(filtered);
    } catch (error) {
      console.error('예약 불러오기 실패:', error);
    }
  };

  fetchData();
}, [selectedPet]);


  // 상세보기 페이지로 이동
  const handleClickDetail = (reservationId: number) => {
    navigate(`/owner/pet/treatment/${reservationId}`);
  };

  // 드롭다운 필터링
  const filtered = records.filter(
    (r) =>
      (!selectedSubject || r.subject === selectedSubject) &&
      (!selectedDate || r.reservationDay === selectedDate)
  );

  // 드롭다운 날짜 옵션 생성
  const uniqueDates = Array.from(new Set(records.map((r) => r.reservationDay)));

  return (
    <div className="space-y-6">
      {/* 드롭다운 필터 */}
      <div className="flex gap-4 w-full">
        <div className="w-1/2">
          <SelectionDropdown
            value={selectedSubject}
            onChange={setSelectedSubject}
            options={[
              { value: '', label: '전체 과목' },
              { value: 'DENTAL', label: '치과' },
              { value: 'DERMATOLOGY', label: '피부과' },
              { value: 'ORTHOPEDICS', label: '정형외과' },
              { value: 'OPHTHALMOLOGY', label: '안과' },
            ]}
            placeholder="과목 필터"
          />
        </div>
        <div className="w-1/2">
          <SelectionDropdown
            value={selectedDate}
            onChange={setSelectedDate}
            options={[
              { value: '', label: '전체 날짜' },
              ...uniqueDates.map((date) => ({ value: date, label: date })),
            ]}
            placeholder="날짜 필터"
          />
        </div>
      </div>

      {/* 진료 카드 리스트 */}
      <div className="space-y-4">
        {filtered.length === 0 && (
          <p className="text-center text-gray-400">진료 내역이 없습니다.</p>
        )}
        {filtered.map((r) => (
          <TreatmentRecordCard
            key={r.reservationId}
            doctorName={r.vetName}
            hospitalName={r.hospitalName}
            treatmentDate={r.reservationDay}
            department={r.subject}
            onClickDetail={() => handleClickDetail(r.reservationId)}
          />
        ))}
      </div>
    </div>
  );
}
