// src/component/pages/Staff/Reservation/StaffReservationTab.tsx
import React, { useEffect, useMemo, useState } from 'react';
import FilterDropdown from '@/component/selection/FilterDropdown';
import ReservationTimeTable from '@/component/table/ReservationTimeTable';
import { useNavigate } from 'react-router-dom';

import { getStaffHospitalReservations } from '@/services/api/Staff/staffreservation';
import { getStaffHospitalDetail, getStaffVetsByHospital } from '@/services/api/Staff/staffhospital';
import { timeMapping, toLocalHHmm } from '@/utils/timeMapping';
import type { DayEng, StaffWorkingHourDto } from '@/types/Staff/staffhospitalType';

interface Vet {
  vetId: number;
  name: string;
  profile?: string;
  photo?: string;
  workingHours?: StaffWorkingHourDto[];
}

interface ReservationData {
  time: string;
  records: {
    reservationId?: number;
    doctor: string;
    pet: string;
    owner: string;
  }[];
}

const DAYS_KO: Record<DayEng, string> = { MON:'월', TUE:'화', WED:'수', THU:'목', FRI:'금', SAT:'토', SUN:'일' };
const DAY_ORDER: DayEng[] = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
const TODAY_ENG: DayEng = DAY_ORDER[new Date().getDay()];

export default function ReservationTab() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [vets, setVets] = useState<Vet[]>([]);
  const [selectedVetId, setSelectedVetId] = useState<string>('all');
  const [rawReservations, setRawReservations] = useState<any[]>([]);

  // ---------- helpers ----------
  const toHHmm = (val: unknown): string => {
    if (typeof val === 'number') return timeMapping[val] ?? '';
    const s = String(val ?? '');
    if (!s) return '';
    if (/^\d+$/.test(s)) return timeMapping[Number(s)] ?? '';
    const parsed = toLocalHHmm(s);
    if (parsed) return parsed;
    const m = s.match(/\b(\d{2}):(\d{2})\b/);
    return m ? `${m[1]}:${m[2]}` : '';
  };

  const hhmmToMinutes = (hhmm: string): number => {
    const [h, m] = hhmm.split(':').map(Number);
    return h * 60 + m;
  };

  const getVetIdFromRes = (r: any, vetList: Vet[]): number | undefined => {
    const direct = r.vetId ?? r.vet_id ?? r?.vet?.vetId ?? r?.vet?.vet_id ?? r?.vet?.id;
    if (typeof direct === 'number') return direct;
    const name = r.vetName ?? r?.vet?.name;
    if (name) {
      const found = vetList.find(v => v.name === name);
      if (found) return found.vetId;
    }
    return undefined;
  };

  const getPetNameFromRes = (r: any): string =>
    r?.pet?.name ?? r.petName ?? r?.petInfo?.name ?? '반려동물';

  const getOwnerNameFromRes = (r: any): string =>
    r?.owner?.name ?? r.ownerName ?? '보호자';

  const getTimeFromRes = (r: any): string =>
    toHHmm(r.reservationTime ?? r.time ?? r.slot ?? r.startTime ?? r.start_time);

  const isRequested = (r: any) =>
    String(r.status ?? '').toUpperCase() === 'REQUESTED';

  // ---------- fetch ----------
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);

        const hospital = await getStaffHospitalDetail();
        if (!alive) return;

        const vetList = await getStaffVetsByHospital(hospital.hospitalId);
        if (!alive) return;

        const vlist: Vet[] = (vetList ?? []).map((v: any) => ({
          vetId: v.vetId,
          name: v.name,
          profile: v.profile,
          photo: v.photo,
          workingHours: (v.workingHours ?? []).map((h: any) => ({
            workingId: h.workingId,
            day: h.day,
            startTime: h.startTime,
            endTime: h.endTime,
          })),
        }));
        setVets(vlist);

        // ✅ 서버에 status=REQUESTED 파라미터 전달
        const reservations = await getStaffHospitalReservations(hospital.hospitalId, {
          status: 'REQUESTED' as any,
        });
        if (!alive) return;
        setRawReservations(Array.isArray(reservations) ? reservations : []);
      } catch (e) {
        console.warn('[ReservationTab] fetch failed:', e);
        setVets([]);
        setRawReservations([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  // ---------- view data ----------
  const reservationData: ReservationData[] = useMemo(() => {
    // 0) 혹시 서버가 status 필터를 무시하면 여기서 한 번 더 필터
    const onlyRequested = (rawReservations || []).filter(isRequested);

    // 1) 정규화(+ vetId 보정)
    const normalized = onlyRequested.map((r: any) => {
      const vid = getVetIdFromRes(r, vets);
      return {
        reservationId: r.reservationId ?? r.id,
        vetId: typeof vid === 'number' ? vid : undefined,
        doctor: r.vetName ?? r?.vet?.name ?? '알 수 없음',
        pet: getPetNameFromRes(r),
        owner: getOwnerNameFromRes(r),
        time: getTimeFromRes(r),
      };
    });

    // 2) 수의사 필터
    const filtered =
      selectedVetId === 'all'
        ? normalized
        : normalized.filter(n => String(n.vetId) === selectedVetId);

    // 3) 시간별 그룹핑
    const grouped: Record<string, ReservationData['records']> = {};
    for (const n of filtered) {
      if (!n.time) continue;
      if (!grouped[n.time]) grouped[n.time] = [];
      grouped[n.time].push({
        reservationId: n.reservationId,
        doctor: n.doctor,
        pet: n.pet,
        owner: n.owner,
      });
    }

    // 4) 시간 오름차순
    return Object.entries(grouped)
      .sort(([t1], [t2]) => hhmmToMinutes(t1) - hhmmToMinutes(t2))
      .map(([time, records]) => ({ time, records }));
  }, [rawReservations, selectedVetId, vets]);

  // 드롭다운: 이름 + 사진 + 오늘 근무시간 캡션
  const dropdownOptions = useMemo(
    () => [
      { value: 'all', label: '전체 수의사' },
      ...vets.map(v => {
        const todayWH = v.workingHours?.find(h => h.day === TODAY_ENG);
        const start = toHHmm(todayWH?.startTime as any);
        const end   = toHHmm(todayWH?.endTime as any);
        const desc  = start && end ? `${DAYS_KO[TODAY_ENG]} ${start}-${end}` : '근무시간 미정';
        return {
          value: String(v.vetId),
          label: v.name,
          description: desc,
          photo: v.photo || undefined
        };
      }),
    ],
    [vets]
  );

  const handleRowClick = (record: {
    reservationId?: number;
    time: string;
    doctor: string;
    pet: string;
    owner: string;
  }) => {
    navigate('/staff/reservation/detail', {
      state: { reservationId: record.reservationId },
    });
  };

  return (
    <div className="space-y-6">
      <FilterDropdown
        options={dropdownOptions}
        value={selectedVetId}
        onChange={setSelectedVetId}
        placeholder="전체 수의사"
      />

      {loading ? (
        <div className="flex items-center justify-center min-h-[200px]">
          <p className="p">불러오는 중…</p>
        </div>
      ) : reservationData.length > 0 ? (
        <>
          <div className="grid grid-cols-4 px-3 mb-4">
            <p className="h4">진료 시간</p>
            <p className="h4 text-center">수의사</p>
            <p className="h4 text-center">진료 대상</p>
            <p className="h4 text-center">보호자</p>
          </div>
          <ReservationTimeTable data={reservationData} onRowClick={handleRowClick} />
        </>
      ) : (
        <div className="flex flex-grow items-center justify-center min-h-[200px]">
          <p className="h4 text-gray-500">현재 확인이 필요한 예약 신청이 없습니다</p>
        </div>
      )}
    </div>
  );
}
