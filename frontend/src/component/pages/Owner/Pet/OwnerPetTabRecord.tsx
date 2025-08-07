import React, { useState } from 'react';
import SelectionDropdown from '@/component/selection/SelectionDropdown';
import TreatmentRecordCard from '@/component/card/TreatmentRecordCard';

export default function OwnerPetTabRecord({ selectedPet }) {
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  // ✅ 반려동물 ID별로 진료 내역 관리
  const [allRecords] = useState({
    1: [
      {
        id: 1,
        doctorName: '이의연',
        hospitalName: '21세기동물병원',
        treatmentDate: '2025.07.20',
        department: '피부과',
      },
    ],
    2: [
      {
        id: 2,
        doctorName: '이의연',
        hospitalName: '21세기동물병원',
        treatmentDate: '2025.07.22',
        department: '피부과',
      },
    ],
  });

  const currentRecords = allRecords[selectedPet.id] || [];

  const filtered = currentRecords.filter(
    (r) =>
      (!selectedSubject || r.department === selectedSubject) &&
      (!selectedDate || r.treatmentDate === selectedDate)
  );

  return (
    <div className="space-y-6">
      {/* 필터 드롭다운 */}
      <div className="flex gap-4 w-full">
        <div className="w-1/2">
          <SelectionDropdown
            value={selectedSubject}
            onChange={setSelectedSubject}
            options={[
              { value: '', label: '전체 과목' },
              { value: '피부과', label: '피부과' },
              { value: '내과', label: '내과' },
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
              { value: '2025.07.20', label: '2025.07.20' },
              { value: '2025.07.22', label: '2025.07.22' },
            ]}
            placeholder="날짜 필터"
          />
        </div>
      </div>

      {/* 진료 내역 카드 */}
      <div className="space-y-4">
        {filtered.length === 0 && <p className="text-center text-gray-400">진료 내역이 없습니다.</p>}
        {filtered.map((r) => (
          <TreatmentRecordCard
            key={r.id}
            doctorName={r.doctorName}
            hospitalName={r.hospitalName}
            treatmentDate={r.treatmentDate}
            department={r.department}
            onClickDetail={() => alert(`${r.treatmentDate} 상세 보기`)}
          />
        ))}
      </div>
    </div>
  );
}
