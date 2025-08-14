// src/component/pages/Owner/Home/OwnerHomeSelectHospital.tsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import BackHeader from '@/component/header/BackHeader';
import SearchInput from '@/component/input/SearchInput';
import DropdownArrow from '@/component/icon/Dropdown_Arrow';

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
  const [visibleHospitalCount, setVisibleHospitalCount] = useState(6);
  const [visibleRecentCount, setVisibleRecentCount] = useState(6);
  const [visibleSuggestCount, setVisibleSuggestCount] = useState(6);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const pet = location.state?.pet; // { petId, ... }
  const abortRef = useRef<AbortController | null>(null);
  const recentLoadMoreRef = useRef<HTMLDivElement>(null);
  const suggestLoadMoreRef = useRef<HTMLDivElement>(null);
  const hospitalLoadMoreRef = useRef<HTMLDivElement>(null);

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
  // useEffect(() => {
  //   (async () => {
  //     try {
  //       const list = await getPublicHospitals();
  //       // 병원 이름 기준 가나다순 정렬
  //       const sortedList = list.sort((a, b) => a.name.localeCompare(b.name));
  //       setHospitals(sortedList);
  //     } catch (e) {
  //       console.warn('병원 리스트 불러오기 실패:', e);
  //       setHospitals([]);
  //     }
  //   })();
  // }, []);

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

  // 무한스크롤 - 최근 방문한 병원
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoadingMore && recents.length > visibleRecentCount) {
          setIsLoadingMore(true);
          setTimeout(() => {
            setVisibleRecentCount((prev) => prev + 6);
            setIsLoadingMore(false);
          }, 300);
        }
      },
      { threshold: 0.1 },
    );

    if (recentLoadMoreRef.current) {
      observer.observe(recentLoadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [visibleRecentCount, recents.length, isLoadingMore]);

  // 무한스크롤 - 검색 결과
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoadingMore && suggests.length > visibleSuggestCount) {
          setIsLoadingMore(true);
          setTimeout(() => {
            setVisibleSuggestCount((prev) => prev + 6);
            setIsLoadingMore(false);
          }, 300);
        }
      },
      { threshold: 0.1 },
    );

    if (suggestLoadMoreRef.current) {
      observer.observe(suggestLoadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [visibleSuggestCount, suggests.length, isLoadingMore]);

  // 무한스크롤 - 병원 전체 목록
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoadingMore && hospitals.length > visibleHospitalCount) {
          setIsLoadingMore(true);
          setTimeout(() => {
            setVisibleHospitalCount((prev) => prev + 6);
            setIsLoadingMore(false);
          }, 300);
        }
      },
      { threshold: 0.1 },
    );

    if (hospitalLoadMoreRef.current) {
      observer.observe(hospitalLoadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [visibleHospitalCount, hospitals.length, isLoadingMore]);

  // 검색 시 자동완성과 병원 목록을 함께 가져옴
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
            setHospitals([]); // 검색어 없으면 병원 목록도 초기화
            setVisibleSuggestCount(6);
            setVisibleHospitalCount(6);
            return;
          }

          // 자동완성과 전체 병원 목록을 병렬로 가져옴
          const [suggestResults, hospitalList] = await Promise.all([
            autocompleteHospitals(keyword, { signal: abortRef.current.signal }),
            getPublicHospitals(),
          ]);

          // 검색 결과 정렬
          const sortedSuggests = suggestResults.sort((a, b) => a.name.localeCompare(b.name));
          setSuggests(sortedSuggests);
          setVisibleSuggestCount(6);

          // 병원 목록도 검색어로 필터링하여 정렬
          const filteredHospitals = hospitalList
            .filter(
              (h) =>
                h.name.toLowerCase().includes(keyword.toLowerCase()) ||
                h.location.toLowerCase().includes(keyword.toLowerCase()),
            )
            .sort((a, b) => a.name.localeCompare(b.name));
          setHospitals(filteredHospitals);
          setVisibleHospitalCount(6);
        } catch (e: any) {
          if (e?.name === 'CanceledError' || e?.name === 'AbortError') return;
          console.warn('검색 실패:', e);
          setSuggests([]);
          setHospitals([]);
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
            {recents.length === 0 && <div className="p-4 text-gray-400 text-center">최근 방문한 병원이 없습니다.</div>}
            {recents.slice(0, visibleRecentCount).map((h, i) => (
              <div
                key={`${h.name}-${i}`}
                className="flex px-0 py-3 bg-gray-50 w-full cursor-pointer"
                onClick={() => handleHospitalClick(h)}
              >
                {/* 텍스트 영역 */}
                <div className="ml-3 flex flex-col justify-center">
                  <span className="h4 text-black">{h.name}</span>
                  <span className="caption text-gray-400">{h.location ?? ''}</span>
                </div>
              </div>
            ))}
            {recents.length > visibleRecentCount && (
              <div ref={recentLoadMoreRef} className="p-4 text-center">
                <span className="text-gray-400 p">{isLoadingMore ? '' : '더보기'}</span>
              </div>
            )}
          </div>
        </div>
        <h4 className="p text-black mb-3 mt-6">검색 결과</h4>
        {/* 검색 결과 (검색어가 있을 때만 표시) */}
        {search.trim() && (
          <div className="mt-6">
            <div className="bg-gray-50 rounded-xl overflow-hidden">
              {suggests.length === 0 && hospitals.length === 0 && (
                <div className="p-4 text-gray-400 text-center">검색 결과가 없습니다.</div>
              )}

              {/* 자동완성 결과 */}
              {suggests.slice(0, visibleSuggestCount).map((s) => (
                <div
                  key={`suggest-${s.hospitalId}`}
                  className="flex items-center px-0 py-3 bg-gray-50 w-full cursor-pointer"
                  onClick={() => handleHospitalClick(s)}
                >
                  <div className="ml-3 flex flex-col justify-center">
                    <span className="h4 text-black">{s.name}</span>
                    <span className="caption text-gray-400">{s.location}</span>
                  </div>
                </div>
              ))}

              {/* 필터링된 병원 목록 */}
              {hospitals.slice(0, visibleHospitalCount).map((h) => (
                <div
                  key={`hospital-${h.hospitalId}`}
                  className="flex items-center px-0 py-3 bg-gray-50 w-full cursor-pointer"
                  onClick={() => handleHospitalClick(h)}
                >
                  <div className="ml-3 flex flex-col justify-center">
                    <span className="h4 text-black">{h.name}</span>
                    <span className="caption text-gray-400">{h.location}</span>
                  </div>
                </div>
              ))}

              {/* 더보기 버튼들 */}
              {suggests.length > visibleSuggestCount && (
                <div ref={suggestLoadMoreRef} className="p-4 text-center">
                  <span className="text-gray-400 p">{isLoadingMore ? '' : '더보기'}</span>
                </div>
              )}
              {hospitals.length > visibleHospitalCount && (
                <div ref={hospitalLoadMoreRef} className="p-4 text-center">
                  <span className="text-gray-400 p">{isLoadingMore ? '' : '더보기'}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 검색어가 없을 때 안내 메시지 */}
        {!search.trim() && (
          <div className="mt-8">
            <div className="bg-gray-50 rounded-xl p-8 text-center">
              <p className="text-gray-400 p">병원명을 검색해주세요.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
