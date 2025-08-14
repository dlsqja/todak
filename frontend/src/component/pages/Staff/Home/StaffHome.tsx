// src/component/pages/Staff/Home/StaffHome.tsx
import React, { useEffect, useMemo, useState } from 'react';
import '@/styles/main.css';
import { useNavigate } from 'react-router-dom';
// (원하면 이 카드 컴포넌트로 대체해서 사용 가능)
// import OwnerTreatmentSimpleCard from '@/component/card/OwnerTreatmentSimpleCard';

import { getStaffHospitalDetail } from '@/services/api/Staff/staffhospital';
import { getStaffHospitalReservations } from '@/services/api/Staff/staffreservation';
import { timeMapping, toLocalHHmm } from '@/utils/timeMapping';
import { speciesMapping } from '@/utils/speciesMapping';
import { genderMapping } from '@/utils/genderMapping';

type HomeCardItem = {
  reservationId?: number;
  vet_name: string;
  time: string;           // "HH:mm"
  pet: string;            // 펫 이름
  petinfo: string;        // "강아지 / 3세 / 여(중성화)"
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

        // 1) 내 병원
        const hospital = await getStaffHospitalDetail();
        if (!alive) return;

        // 2) 해당 병원의 예약 (REQUESTED만)
        const list = await getStaffHospitalReservations(hospital?.hospitalId, {
          status: 'REQUESTED' as any,
        });
        if (!alive) return;

        const mapped: HomeCardItem[] = (Array.isArray(list) ? list : [])
          .filter(isRequested)
          .map((r: any) => {
            // 시간
            const time = toHHmm(r?.reservationTime ?? r?.time ?? r?.slot ?? r?.startTime);
            // 수의사명
            const vetName = r?.vetName ?? r?.vet?.name ?? '알 수 없음';
            // 펫 이름
            const petName = r?.pet?.name ?? r?.petName ?? '반려동물';
            // 펫 상세 (종 / 나이 / 성별)
            const speciesRaw = r?.pet?.species ?? r?.petSpecies;
            const speciesLabel =
              speciesRaw ? (speciesMapping[String(speciesRaw) as keyof typeof speciesMapping] ?? String(speciesRaw)) : undefined;

            const ageRaw = r?.pet?.age ?? r?.petAge;
            const ageLabel = typeof ageRaw === 'number' ? `${ageRaw}세` : undefined;

            const genderRaw = r?.pet?.gender ?? r?.petGender;
            const genderLabel =
              genderRaw ? (genderMapping[String(genderRaw) as keyof typeof genderMapping] ?? String(genderRaw)) : undefined;

            const petinfo = [speciesLabel, ageLabel, genderLabel].filter(Boolean).join(' / ');

            return {
              reservationId: r?.reservationId ?? r?.id,
              vet_name: vetName,
              time: time || '-',
              pet: petName,
              petinfo: petinfo || '',
            };
          })
          // 시간 기준 오름차순
          .sort((a, b) => toMinutes(a.time || '00:00') - toMinutes(b.time || '00:00'));

        setCards(mapped);
      } catch {
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
        className="h5 mx-7 px-5 py-1 rounded-full inline-block 
        bg-green-300 text-green-100 hover:bg-green-200 transition"
      >
        {guideText}
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
