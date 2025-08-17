import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SelectionDropdown from '@/component/selection/SelectionDropdown';
import TreatmentRecordCard from '@/component/card/TreatmentRecordCard';
import { getTreatments } from '@/services/api/Owner/ownertreatment';
import type { Pet } from '@/types/Owner/ownerpetType';
import { subjectMapping } from '@/utils/subjectMapping';

// 그대로 사용
type Subject = 'DENTAL' | 'DERMATOLOGY' | 'ORTHOPEDICS' | 'OPHTHALMOLOGY';

interface OwnerPetTabRecordProps {
  selectedPet: Pet;
}

type UIRecord = {
  id: number;
  vetName: string;
  hospitalName?: string;
  subject: Subject | string;
  treatmentDay: string; // YYYY-MM-DD
};

// 필요할 때만 ownerreservation을 동적 로드
async function buildHospitalMap() {
  try {
    const { getReservations } = await import('@/services/api/Owner/ownerreservation');
    const resGroups = await getReservations(); // [{ petResponse, reservations }, ...]
    const map = new Map<number, string>();
    resGroups?.forEach((g: any) =>
      g?.reservations?.forEach((r: any) => map.set(r.reservationId, r.hospitalName)),
    );
    return map;
  } catch (e) {
    console.warn('병원명 맵 생성 실패, 병원명 미표시로 진행:', e);
    return new Map<number, string>();
  }
}

// 정렬/존재 체크용: 문자열 "YYYY-MM-DD HH:mm:ss.ssssss"도 안전 파싱
const toMillisLoose = (v?: unknown): number => {
  if (v == null) return 0;
  const s = String(v).trim();
  if (!s) return 0;
  let iso = s.replace(' ', 'T').replace(/\.(\d{3})\d+$/, '.$1');
  if (/T/.test(iso) && !/(Z|[+\-]\d{2}:?\d{2})$/i.test(iso)) iso += 'Z';
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? 0 : d.getTime();
};

// 상세 페이지와 동일한 규칙의 YYYY-MM-DD 변환기
const getLocalYMD = (v?: unknown): string => {
  if (v == null) return '';
  if (typeof v === 'number' || v instanceof Date) {
    const d = new Date(v as any);
    if (Number.isNaN(d.getTime())) return '';
    const yy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yy}-${mm}-${dd}`;
  }
  const raw = String(v).trim();
  if (!raw) return '';
  const m = raw.match(/^(\d{4}-\d{2}-\d{2})\b/);
  if (m) return m[1]; // 문자열이면 앞 10자리만(타임존 보정 금지)
  let iso = raw.replace(' ', 'T').replace(/\.(\d{3})\d+$/, '.$1');
  if (/T/.test(iso) && !/(Z|[+\-]\d{2}:?\d{2})$/i.test(iso)) iso += 'Z';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const yy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yy}-${mm}-${dd}`;
};

// 시작/종료 시각이 하나라도 있으면 "실제 진료"로 간주
const hasRealTreatmentTime = (start?: unknown, end?: unknown): boolean =>
  toMillisLoose(start) > 0 || toMillisLoose(end) > 0;

export default function OwnerPetTabRecord({ selectedPet }: OwnerPetTabRecordProps) {
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [records, setRecords] = useState<UIRecord[]>([]);
  const navigate = useNavigate();

  // 👇 추가: 드롭다운 동시 오픈 방지용 전역 상태
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedPet?.petId) return;

    const fetchData = async () => {
      try {
        const [treats, hospitalMap] = await Promise.all([
          getTreatments(),          // [{ petResponse, treatments }]
          buildHospitalMap(),       // Map<reservationId, hospitalName>
        ]);

        const matched = treats.find((e) => e.petResponse?.petId === selectedPet.petId);

        const withSortKey =
          (matched?.treatments ?? [])
            .map((t: any) => {
              const info = t?.treatmentInfo ?? t?.treatementInfo ?? t;
              const start =
                info?.startTime ?? info?.start_time ?? t?.startTime ?? t?.start_time;
              const end =
                info?.endTime ?? info?.end_time ?? t?.endTime ?? t?.end_time;

              if (!hasRealTreatmentTime(start, end)) return null;

              const dayYMD =
                getLocalYMD(start) ||
                getLocalYMD(end) ||
                getLocalYMD(t?.reservationDay) ||
                getLocalYMD(t?.reservation_day) ||
                '-';

              const sortKey =
                toMillisLoose(start) ||
                toMillisLoose(end) ||
                (dayYMD !== '-' ? toMillisLoose(`${dayYMD}T00:00:00`) : 0);

              const row: UIRecord = {
                id:
                  t?.reservationId ??
                  t?.reservation_id ??
                  t?.reservation?.reservationId ??
                  t?.id,
                vetName: t.vetName,
                subject: t.subject,
                treatmentDay: dayYMD,
                hospitalName: t.hospitalName ?? hospitalMap.get(t.reservationId) ?? '-',
              };
              return { row, sortKey };
            })
            .filter(Boolean) as Array<{ row: UIRecord; sortKey: number }>;

        withSortKey.sort((a, b) => b.sortKey - a.sortKey);
        setRecords(withSortKey.map((x) => x.row));
      } catch (e) {
        console.error('진료 내역 불러오기 실패:', e);
        setRecords([]);
      }
    };

    fetchData();
  }, [selectedPet]);

  const handleClickDetail = (reservationId: number) => {
    navigate(`/owner/pet/treatment/detail/${reservationId}`, {
      state: { returnTab: '진료 내역', petId: selectedPet?.petId },
    });
  };

  const filtered = records.filter(
    (t) =>
      (!selectedSubject || t.subject === (selectedSubject as any)) &&
      (!selectedDate || t.treatmentDay === selectedDate),
  );

  const uniqueDates = Array.from(new Set(records.map((t) => t.treatmentDay))).filter(
    (d) => !!d && d !== '-',
  );

  return (
    <div className="space-y-6">
      <div className="flex gap-4 w-full">
        <div className="w-1/2">
          <SelectionDropdown
            value={selectedSubject}
            onChange={setSelectedSubject}
            options={[
              { value: 'DENTAL', label: '치과' },
              { value: 'DERMATOLOGY', label: '피부과' },
              { value: 'ORTHOPEDICS', label: '정형외과' },
              { value: 'OPHTHALMOLOGY', label: '안과' },
            ]}
            placeholder="과목 필터"
            // 👇 새 props
            dropdownId="subjectDropdown"
            activeDropdown={activeDropdown}
            setActiveDropdown={setActiveDropdown}
          />
        </div>
        <div className="w-1/2">
          <SelectionDropdown
            value={selectedDate}
            onChange={setSelectedDate}
            options={[...uniqueDates.map((d) => ({ value: d, label: d }))]}
            placeholder="날짜 필터"
            // 👇 새 props
            dropdownId="dateDropdown"
            activeDropdown={activeDropdown}
            setActiveDropdown={setActiveDropdown}
          />
        </div>
      </div>

      <div className="space-y-4">
        {filtered.length === 0 && <p className="text-center text-gray-400">진료 내역이 없습니다.</p>}
        {filtered.map((t) => (
          <TreatmentRecordCard
            key={t.id}
            doctorName={t.vetName}
            hospitalName={t.hospitalName}
            treatmentDate={t.treatmentDay}
            department={subjectMapping[t.subject as Subject] ?? (t.subject as string)}
            onClickDetail={() => handleClickDetail(t.id)}
          />
        ))}
      </div>
    </div>
  );
}
