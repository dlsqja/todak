import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SelectionDropdown from '@/component/selection/SelectionDropdown';
import TreatmentRecordCard from '@/component/card/TreatmentRecordCard';
import { getTreatments } from '@/services/api/Owner/ownertreatment';
import type { Pet } from '@/types/Owner/ownerpetType';
import { subjectMapping } from '@/utils/subjectMapping';

type Subject = 'DENTAL' | 'DERMATOLOGY' | 'ORTHOPEDICS' | 'OPHTHALMOLOGY';

interface OwnerPetTabRecordProps {
  selectedPet: Pet;
}

type UIRecord = {
  id: number;
  vetName: string;
  hospitalName?: string;
  subject: Subject;
  treatmentDay: string;
};

// 필요할 때만 ownerreservation을 동적 로드
async function buildHospitalMap() {
  try {
    const { getReservations } = await import('@/services/api/Owner/ownerreservation');
    const resGroups = await getReservations(); // [{ petResponse, reservations }, ...]
    const map = new Map<number, string>();
    resGroups?.forEach((g: any) => g?.reservations?.forEach((r: any) => map.set(r.reservationId, r.hospitalName)));
    return map;
  } catch (e) {
    console.warn('병원명 맵 생성 실패, 병원명 미표시로 진행:', e);
    return new Map<number, string>();
  }
}

export default function OwnerPetTabRecord({ selectedPet }: OwnerPetTabRecordProps) {
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [records, setRecords] = useState<UIRecord[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!selectedPet?.petId) return;

    const fetchData = async () => {
      try {
        const [treats, hospitalMap] = await Promise.all([
          getTreatments(), // [{ petResponse, treatments }]
          buildHospitalMap(), // Map<reservationId, hospitalName>
        ]);

        const matched = treats.find((e) => e.petResponse.petId === selectedPet.petId);
        const rows: UIRecord[] = (matched?.treatments ?? []).map((t: any) => {
          const day = t?.reservationDay ?? (t?.treatmentInfo?.startTime ? t.treatmentInfo.startTime.slice(0, 10) : '');

          return {
            id: t.reservationId,
            vetName: t.vetName,
            subject: t.subject,
            treatmentDay: day,
            hospitalName: t.hospitalName ?? hospitalMap.get(t.reservationId) ?? '-', // 보강
          };
        });

        setRecords(rows);
      } catch (e) {
        console.error('진료 내역 불러오기 실패:', e);
      }
    };

    fetchData();
  }, [selectedPet]);

  const handleClickDetail = (reservationId: number) => {
    navigate(`/owner/pet/treatment/detail/${reservationId}`, {
      state: {
        returnTab: '진료 내역',
        petId: selectedPet?.petId,
      },
    });
  };

  const filtered = records.filter(
    (t) => (!selectedSubject || t.subject === selectedSubject) && (!selectedDate || t.treatmentDay === selectedDate),
  );

  const uniqueDates = Array.from(new Set(records.map((t) => t.treatmentDay))).filter(Boolean);

  return (
    <div className="space-y-6">
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
            options={[{ value: '', label: '전체 날짜' }, ...uniqueDates.map((d) => ({ value: d, label: d }))]}
            placeholder="날짜 필터"
          />
        </div>
      </div>

      <div className="space-y-4">
        {filtered.length === 0 && <p className="text-center text-gray-400">진료 내역이 없습니다.</p>}
        {filtered.map(
          (t) => (
            console.log(t),
            (
              <TreatmentRecordCard
                key={t.id}
                doctorName={t.vetName}
                hospitalName={t.hospitalName}
                treatmentDate={t.treatmentDay}
                department={subjectMapping[t.subject] ?? t.subject}
                onClickDetail={() => handleClickDetail(t.id)}
              />
            )
          ),
        )}
      </div>
    </div>
  );
}
