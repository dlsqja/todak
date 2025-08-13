// src/component/pages/Owner/Home/OwnerHomeSelectVet.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import BackHeader from '@/component/header/BackHeader';
import SearchInput from '@/component/input/SearchInput';
import SearchListItem from '@/component/card/SearchListItem';
import { getVetsByHospitalId } from '@/services/api/Owner/ownerhome';
import { getTreatments } from '@/services/api/Owner/ownertreatment';
import type { VetPublic, WorkingHourResponse } from '@/types/Owner/ownerhomeType';
import type { OwnerTreatmentsByPet, OwnerTreatmentItem } from '@/types/Owner/ownertreatmentType';
import { timeMapping } from '@/utils/timeMapping';

const dayIdxToCode: ('SUN'|'MON'|'TUE'|'WED'|'THU'|'FRI'|'SAT')[] =
  ['SUN','MON','TUE','WED','THU','FRI','SAT'];
const dayCodeToKo: Record<string,string> = {
  SUN:'일', MON:'월', TUE:'화', WED:'수', THU:'목', FRI:'금', SAT:'토'
};

type RecentVet = VetPublic;

// 비교용 정규화(대소문자/공백 제거)
const norm = (s?: string) => (s ?? '').toLowerCase().replace(/\s+/g, '').trim();

// 정렬용 timestamp (오타/누락 방어)
const getSortTimestamp = (t: OwnerTreatmentItem) => {
  const info: any = (t as any).treatementInfo ?? (t as any).treatmentInfo ?? {};
  const end = info?.endTime ?? (t as any).endTime;
  const start = info?.startTime ?? (t as any).startTime;
  const day = t.reservationDay;
  const pick = end || start || day || '';
  const ms = pick ? new Date(pick).getTime() : 0;
  return Number.isFinite(ms) ? ms : 0;
};

export default function SelectVetPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const hospital = location.state?.hospital as { hospitalId?: number; name?: string };
  const pet = location.state?.pet;

  const [search, setSearch] = useState('');
  const [vets, setVets] = useState<VetPublic[]>([]);
  const [recentVets, setRecentVets] = useState<RecentVet[]>([]);

  // 병원 수의사 목록 (+ 근무시간 포함)
  useEffect(() => {
    if (!hospital?.hospitalId) return;
    (async () => {
      try {
        const list = await getVetsByHospitalId(Number(hospital.hospitalId));
        setVets(list ?? []);
      } catch {
        setVets([]);
      }
    })();
  }, [hospital?.hospitalId]);

  // “최근 진료받은 수의사”(해당 병원 한정, hospitalName 없으면 vetName으로 교차검증)
  useEffect(() => {
    if (!pet?.petId || !hospital?.name) return;

    (async () => {
      try {
        const buckets: OwnerTreatmentsByPet[] = await getTreatments();
        const bucket = buckets.find(b => b.petResponse?.petId === pet.petId);
        const items: OwnerTreatmentItem[] = bucket?.treatments ?? [];

        // 필터 전 행 구성
        const rowsAll = items.map(t => {
          const info: any = (t as any).treatementInfo ?? (t as any).treatmentInfo ?? {};
          return {
            vetName: t.vetName ?? '',
            hospitalName: (t as any).hospitalName ?? '',
            ts: getSortTimestamp(t),
            eqHospital: norm((t as any).hospitalName) === norm(hospital.name),
          };
        });

        // 병원명이 있으면 현재 병원과 일치해야 하고,
        // 병원명이 없으면 vetName만으로 일단 통과(후단에서 vets 목록으로 교차검증)
        const rows = rowsAll
          .filter(x => x.vetName && x.ts > 0 && (x.eqHospital || !x.hospitalName))
          .sort((a, b) => b.ts - a.ts);

        // 수의사명 기준 중복 제거
        const seen = new Set<string>();
        const uniqueNames = rows
          .filter(r => (seen.has(norm(r.vetName)) ? false : (seen.add(norm(r.vetName)), true)))
          .map(r => r.vetName)
          .slice(0, 5);

        // 현재 병원 수의사 목록과 교차검증 → 카드 표시용 데이터
        const recent = uniqueNames
          .map(name => vets.find(v => norm(v.name) === norm(name)))
          .filter(Boolean) as RecentVet[];

        setRecentVets(recent);
      } catch {
        setRecentVets([]);
      }
    })();
  }, [pet?.petId, hospital?.name, vets]);

  // 오늘 요일
  const todayCode = useMemo(() => dayIdxToCode[new Date().getDay()], []);
  const todayKo = dayCodeToKo[todayCode];

  // 오늘 근무시간 표시
  const renderTodayWork = (wh?: WorkingHourResponse[]) => {
    if (!wh || wh.length === 0) return `(${todayKo}) 근무정보 없음`;
    const today = wh.find(w => w.day === todayCode);
    if (!today) return `(${todayKo}) 근무정보 없음`;

    const start = timeMapping[today.startTime] ?? '';
    const end = timeMapping[today.endTime] ?? '';
    return (start && end)
      ? `(${todayKo}) ${start}~${end}`
      : `(${todayKo}) 근무정보 없음`;
  };

  // 검색(수의사명)
  const filtered = vets.filter(v =>
    !search.trim() || v.name.toLowerCase().includes(search.trim().toLowerCase())
  );

  const handleClick = (vet: VetPublic) => {
    navigate('/owner/home/vet-info', { state: { hospital, pet, vet } });
  };

  return (
    <div className="min-h-screen pb-4">
      <BackHeader text="수의사 선택" />
      <div className="px-7 py-6">
        <p className="p text-black mb-4 text-center">
          {hospital?.name}의 수의사를 선택해주세요.
        </p>

        <SearchInput placeholder="수의사명" value={search} onChange={setSearch} />

        {/* 최근 진료받은 수의사 (항상 표시) */}
        <div className="mt-8">
          <h4 className="p text-black mb-3">최근 진료받은 수의사</h4>
          <div className="bg-gray-50 rounded-xl overflow-hidden">
            {recentVets.length === 0 && (
              <div className="p-4 text-gray-400">최근 진료 이력이 없습니다.</div>
            )}
            {recentVets.map(v => (
              <SearchListItem
                key={`recent-${v.vetId}`}
                name={v.name}
                description={renderTodayWork(v.workingHours)}
                onClick={() => handleClick(v)}
              />
            ))}
          </div>
        </div>

        {/* 검색 결과 (검색어가 있을 때만 표시) */}
        {search.trim() && (
          <div className="mt-6">
            <h4 className="p text-black mb-3">검색 결과</h4>
            <div className="bg-gray-50 rounded-xl overflow-hidden">
              {filtered.length === 0 && (
                <div className="p-4 text-gray-400">검색 결과가 없습니다.</div>
              )}
              {filtered.map(v => (
                <SearchListItem
                  key={`search-${v.vetId}`}
                  name={v.name}
                  description={renderTodayWork(v.workingHours)}
                  onClick={() => handleClick(v)}
                />
              ))}
            </div>
          </div>
        )}

        {/* 전체 수의사 목록 (검색어가 없을 때만 표시) */}
        {!search.trim() && (
          <div className="mt-6">
            <h4 className="p text-black mb-3">수의사 목록</h4>
            <div className="bg-gray-50 rounded-xl overflow-hidden">
              {vets.length === 0 && (
                <div className="p-4 text-gray-400">등록된 수의사가 없습니다.</div>
              )}
              {vets.map(v => (
                <SearchListItem
                  key={`all-${v.vetId}`}
                  name={v.name}
                  description={renderTodayWork(v.workingHours)}
                  onClick={() => handleClick(v)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
