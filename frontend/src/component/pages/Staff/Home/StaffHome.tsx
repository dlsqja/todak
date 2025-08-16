// src/component/pages/Staff/Home/StaffHome.tsx
import React, { useEffect, useMemo, useState } from 'react';
import '@/styles/main.css';
import { useNavigate } from 'react-router-dom';
import { getStaffHospitalDetail } from '@/services/api/Staff/staffhospital';
import { getStaffHospitalReservations } from '@/services/api/Staff/staffreservation';
import { timeMapping, toLocalHHmm } from '@/utils/timeMapping';
import { speciesMapping } from '@/utils/speciesMapping';
import { genderMapping } from '@/utils/genderMapping';
import { FiChevronRight } from 'react-icons/fi';

type HomeCardItem = {
  reservationId?: number;
  vet_name: string;
  time: string;
  pet: string;
  petinfo: string;
};

const DEBUG = true;

// 안전 경로 접근 util: get(r, 'pet.species')
const getIn = (obj: any, path: string) =>
  path.split('.').reduce((a, k) => (a == null ? a : a[k]), obj);

// 후보 키들 중 첫 번째로 값이 있는 키/값 반환
const pickFirst = (obj: any, keys: string[]) => {
  for (const k of keys) {
    const v = getIn(obj, k);
    if (v != null && String(v).trim() !== '') return { key: k, value: v };
  }
  return { key: '', value: undefined };
};

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

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

const isRequested = (r: any) => String(r?.status ?? '').toUpperCase() === 'REQUESTED';

export default function StaffHome() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [cards, setCards] = useState<HomeCardItem[]>([]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);

        const hospital = await getStaffHospitalDetail();
        if (!alive) return;
        DEBUG && console.groupCollapsed('[StaffHome] fetch');
        DEBUG && console.log('hospital:', hospital);

        const list = await getStaffHospitalReservations(hospital?.hospitalId, {
          status: 'REQUESTED' as any,
        });
        if (!alive) return;

        DEBUG && console.log('raw reservations len:', Array.isArray(list) ? list.length : 0);
        DEBUG && console.log('sample[0..2]:', Array.isArray(list) ? list.slice(0, 3) : list);
        (window as any)._staffHomeRaw = list;

        const mapped: HomeCardItem[] = (Array.isArray(list) ? list : [])
  .filter(isRequested)
  .map((r: any, idx: number) => {
    // 시간
    const time = toHHmm(
      r?.reservationTime != null ? r.reservationTime
      : r?.startTime != null ? r.startTime
      : r?.time != null ? r.time
      : r?.slot
    );

    // 수의사/펫 기본
    const vetName = (r?.vetName != null && String(r.vetName)) || (r?.vet?.name ?? '알 수 없음');
    const petName = (r?.pet?.name != null && String(r.pet.name)) || (r?.petName ?? '반려동물');

    // --- petinfo 조립 (종 / 나이 / 성별[+중성화]) ---
    // species
    const rawSpecies = r?.pet?.species;
    const speciesKey = rawSpecies != null ? String(rawSpecies).toUpperCase() : '';
    const speciesLabel =
      (speciesKey && (speciesMapping as any)[speciesKey]) ||
      (rawSpecies != null ? String(rawSpecies) : '');

    // age
    const rawAge = r?.pet?.age;
    const ageLabel = (rawAge != null && String(rawAge) !== '') ? `${Number(rawAge)}세` : '';

    // gender
    const rawGender = r?.pet?.gender;
    const genderKey = rawGender != null ? String(rawGender).toUpperCase() : '';
    let genderLabel =
      (genderKey && (genderMapping as any)[genderKey]) ||
      (rawGender != null ? String(rawGender) : '');

    // neutered(있으면 표시)
    const neutered =
      r?.pet?.isNeutered ?? r?.pet?.neutered ?? r?.pet?.neutralized;
    if (genderLabel && neutered) genderLabel += '(중성화)';

    const petinfo = [speciesLabel, ageLabel, genderLabel].filter(Boolean).join(' / ');

    // 가벼운 디버그 (필요 없으면 지워도 됨)
    if (idx < 3) {
      console.debug('[StaffHome] card sample', {
        petName,
        speciesLabel,
        ageLabel,
        genderLabel,
        time,
      });
    }

    return {
      reservationId: r?.reservationId ?? r?.id,
      vet_name: vetName,
      time: time || '-',
      pet: petName,
      petinfo: petinfo || '-', // 정보가 일부 비어도 최소한 대시
    };
  })
  .sort((a, b) => toMinutes(a.time || '00:00') - toMinutes(b.time || '00:00'));

        setCards(mapped);
        DEBUG && console.groupEnd();
        (window as any)._staffHomeCards = mapped;
      } catch (e) {
        DEBUG && console.error('[StaffHome] fetch error:', e);
        setCards([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []); 

  const handleClickCard = (reservationId?: number) => {
    if (!reservationId) return;
    navigate('/staff/reservation/detail', { state: { reservationId } });
  };

  const title = useMemo(() => '예약 신청 목록', []);
  const guideText = useMemo(() => '비대면 진료 가이드', []);

  return (
    <div>
      <h3 className="h3 mx-7 pt-13">병원 관계자님 반갑습니다!</h3>
      <h3 className="h3 mx-7 mb-2">어플 사용이 처음이신가요?</h3>
      <button
        onClick={() => navigate('/staff/home/guide')}
        className="h4 mx-7 px-6 py-2 rounded-full inline-block bg-green-300 hover:bg-green-400 text-green-100 cursor-pointer"
      >
        <div className="flex items-center gap-3">
          {guideText} <FiChevronRight className="w-4 h-4" />
        </div>
      </button>

      <h3 className="mx-7 h3 mt-11">{title}</h3>

      <div className="overflow-x-auto overflow-visible snap-x snap-mandatory scroll-smooth hide-scrollbar mx-7 pt-3 pb-6">
        <div className="w-max flex gap-4 h-full p-3">
          {loading ? (
            <div className="p text-gray-500">불러오는 중…</div>
          ) : cards.length === 0 ? (
            <div className="h4 text-gray-500">대기 중인 예약이 없습니다</div>
          ) : (
            cards.map((reservation) => (
              <button
                key={reservation.reservationId ?? `${reservation.vet_name}-${reservation.time}-${reservation.pet}`}
                onClick={() => handleClickCard(reservation.reservationId)}
                className="px-5 py-4 bg-white rounded-[12px] shadow-[0px_5px_15px_rgba(0,0,0,0.08)] w-50 text-left hover:bg-gray-50 transition"
              >
                <h4 className="h4 text-black">{reservation.time}</h4>
                <h4 className="h4 text-black">{reservation.vet_name} 수의사님</h4>
                <p className="p mt-1 text-black">{reservation.pet}</p>
                <p className="p mt-2 text-black">{reservation.petinfo}</p>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
