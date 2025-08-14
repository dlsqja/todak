// src/component/pages/Owner/Home/OwnerHomeSelectHospital.tsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import BackHeader from '@/component/header/BackHeader';
import SearchInput from '@/component/input/SearchInput';

import { getPublicHospitals, autocompleteHospitals } from '@/services/api/Owner/ownerhome';
import { getTreatments } from '@/services/api/Owner/ownertreatment';
import type { HospitalPublic, HospitalSuggest } from '@/types/Owner/ownerhomeType';
import type { OwnerTreatmentsByPet, OwnerTreatmentItem } from '@/types/Owner/ownertreatmentType';
import { getReservationDetail } from '@/services/api/Owner/ownerreservation';

type RecentHospital = {
  hospitalId?: number;
  name: string;
  location?: string;
};

export default function SelectHospitalPage() {
  const [search, setSearch] = useState('');
  const [hospitals, setHospitals] = useState<HospitalPublic[]>([]);
  const [suggests, setSuggests] = useState<HospitalSuggest[]>([]);
  const [recents, setRecents] = useState<RecentHospital[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const pet = location.state?.pet; // { petId, ... }
  const abortRef = useRef<AbortController | null>(null);

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

  // 전체 병원
  useEffect(() => {
    (async () => {
      try {
        const list = await getPublicHospitals();
        setHospitals(list);
      } catch (e) {
        console.warn('병원 리스트 불러오기 실패:', e);
        setHospitals([]);
      }
    })();
  }, []);

  // 최근 방문 병원(항상 위에 표시)
  useEffect(() => {
    if (!pet?.petId) return;

    (async () => {
      try {
        const buckets: OwnerTreatmentsByPet[] = await getTreatments();
        const bucket = buckets.find((b) => b.petResponse?.petId === pet.petId);
        const items: OwnerTreatmentItem[] = bucket?.treatments ?? [];

        // 최신 10개만 후보로(상세 N+1 방지)
        const candidates = items
          .map((t) => ({ t, ts: getSortTimestamp(t) }))
          .filter((x) => x.ts > 0)
          .sort((a, b) => b.ts - a.ts)
          .slice(0, 10)
          .map((x) => x.t);

        // hospitalName 없으면 예약 상세로 보강
        const enriched = await Promise.all(
          candidates.map(async (t) => {
            let hospitalName = (t as any).hospitalName ?? '';

            if (!hospitalName) {
              try {
                const detail = await getReservationDetail(t.reservationId);
                // 상세에서 병원명 확보
                hospitalName = (detail as any)?.hospitalName ?? '';
              } catch {
                // 상세 실패는 스킵
              }
            }

            // 이름만 확보해도 표시 가능. id/location은 public 목록 매칭으로 보강
            const match = hospitalName ? hospitals.find((h) => h.name === hospitalName) : undefined;

            return {
              hospitalName,
              hospitalId: match?.hospitalId,
              location: match?.location ?? '',
            };
          }),
        );

        // 병원명 있는 것만 최신순 유니크
        const seen = new Set<string>();
        const uniq = enriched
          .filter((e) => e.hospitalName)
          .filter((e) => (seen.has(e.hospitalName) ? false : (seen.add(e.hospitalName), true)))
          .slice(0, 5);

        const recentHospitals: RecentHospital[] = uniq.map((e) => ({
          hospitalId: e.hospitalId,
          name: e.hospitalName,
          location: e.location,
        }));

        setRecents(recentHospitals);
      } catch (e) {
        console.warn('최근 방문 병원 구성 실패:', e);
        setRecents([]);
      }
    })();
  }, [pet?.petId, hospitals]);

  // 자동완성 (검색창에 글자 있을 때만 결과 섹션 보이고, 없으면 전체 목록 섹션 보임)
  const debouncedSearch = useMemo(() => {
    let t: number | undefined;
    return (q: string) => {
      if (t) window.clearTimeout(t);
      t = window.setTimeout(async () => {
        try {
          const keyword = q.trim();
          // 직전 요청 취소
          abortRef.current?.abort();
          abortRef.current = new AbortController();

          if (!keyword) {
            setSuggests([]);
            return;
          }

          const s = await autocompleteHospitals(keyword, { signal: abortRef.current.signal });
          setSuggests(s);
        } catch (e: any) {
          if (e?.name === 'CanceledError' || e?.name === 'AbortError') return;
          console.warn('자동완성 실패:', e);
          setSuggests([]);
        }
      }, 250);
    };
  }, []);

  useEffect(() => {
    debouncedSearch(search);
  }, [search, debouncedSearch]);

  const handleHospitalClick = (h: { hospitalId?: number; name: string; location?: string }) => {
    if (!h.hospitalId) {
      alert('이 진료 내역에는 병원 정보가 없어 이동할 수 없어요.');
      return;
    }
    navigate('/owner/home/vet', { state: { hospital: h, pet } });
  };

  return (
    <div className="min-h-screen pb-4">
      <BackHeader text="병원 선택" />
      <div className="px-7 py-6">
        <p className="p text-black mb-4 text-center">진료 받을 병원을 선택해주세요.</p>

        <SearchInput placeholder="병원명 혹은 병원 주소" value={search} onChange={setSearch} />

        {/* 최근 방문한 병원 (항상 표시) */}
        <div className="mt-8">
          <h4 className="p text-black mb-3">최근 방문한 병원</h4>
          <div className="bg-gray-50 rounded-xl overflow-hidden">
            {recents.length === 0 && <div className="p-4 text-gray-400">최근 방문한 병원이 없습니다.</div>}
            {recents.map((h, i) => (
              <div
                key={`${h.name}-${i}`}
                className="flex items-center px-0 py-3 bg-gray-50 w-full cursor-pointer"
                onClick={() => handleHospitalClick(h)}
              >
                {/* 텍스트 영역 */}
                <div className="ml-3 flex flex-col justify-center">
                  <span className="h4 text-black">{h.name}</span>
                  <span className="caption text-gray-400">{h.location ?? ''}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 검색 결과 (검색어가 있을 때만 표시) */}
        {search.trim() && (
          <div className="mt-6">
            <h4 className="p text-black mb-3">검색 결과</h4>
            <div className="bg-gray-50 rounded-xl overflow-hidden">
              {suggests.length === 0 && <div className="p-4 text-gray-400">검색 결과가 없습니다.</div>}
              {suggests.map((s) => (
                <div
                  key={s.hospitalId}
                  className="flex items-center px-0 py-3 bg-gray-50 w-full cursor-pointer"
                  onClick={() => handleHospitalClick(s)}
                >
                  {/* 텍스트 영역 */}
                  <div className="ml-3 flex flex-col justify-center">
                    <span className="h4 text-black">{s.name}</span>
                    <span className="caption text-gray-400">{s.location}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 병원 전체 목록 (검색어가 없을 때만 표시) */}
        {!search.trim() && (
          <div className="mt-8">
            <h4 className="p text-black mb-3">병원 목록</h4>
            <div className="bg-gray-50 rounded-xl overflow-hidden">
              {hospitals.map((h) => (
                <div
                  key={h.hospitalId}
                  className="flex items-center px-0 py-3 bg-gray-50 w-full cursor-pointer"
                  onClick={() => handleHospitalClick(h)}
                >
                  {/* 텍스트 영역 */}
                  <div className="ml-3 flex flex-col justify-center">
                    <span className="h4 text-black">{h.name}</span>
                    <span className="caption text-gray-400">{h.location}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
