import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import BackHeader from '@/component/header/BackHeader';
import SearchInput from '@/component/input/SearchInput';
import SearchListItem from '@/component/card/SearchListItem';
import { getPublicHospitals, autocompleteHospitals } from '@/services/api/Owner/ownerhome';
import { getTreatments } from '@/services/api/Owner/ownertreatment';
import type { HospitalPublic, HospitalSuggest } from '@/types/Owner/ownerhomeType';

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

  // 전체 병원 불러오기
  useEffect(() => {
    (async () => {
      try {
        const list = await getPublicHospitals();
        setHospitals(list);
      } catch (e) {
        console.warn('병원 리스트 불러오기 실패:', e);
      }
    })();
  }, []);

  // 선택한 펫의 최근 방문 병원 구성
  useEffect(() => {
    if (!pet?.petId) return;

    (async () => {
      try {
        const buckets = await getTreatments(); // [{ petResponse, treatments }, ...]
        const bucket = buckets.find(b => b.petResponse?.petId === pet.petId);
        const list = (bucket?.treatments ?? [])
          .map(t => {
            // 가장 신뢰도 높은 시간값 우선 사용
            const info: any = (t as any).treatementInfo ?? (t as any).treatmentInfo ?? {};
            const ts =
              info?.endTime ||
              info?.startTime ||
              (t as any).endTime ||
              (t as any).startTime ||
              (t as any).reservationDay ||
              '';
            return {
              hospitalName: (t as any).hospitalName ?? '',
              ts: ts ? new Date(ts).getTime() : 0,
            };
          })
          // 유효 시간만 남기고 최신순 정렬
          .filter(x => x.hospitalName)
          .sort((a, b) => b.ts - a.ts);

        // 병원명 기준 중복 제거
        const seen = new Set<string>();
        const uni = list.filter(x => {
          if (seen.has(x.hospitalName)) return false;
          seen.add(x.hospitalName);
          return true;
        });

        // public 병원 목록과 이름으로 매칭하여 id/location 보강
        const recentHospitals: RecentHospital[] = uni.slice(0, 5).map(x => {
          const match = hospitals.find(h => h.name === x.hospitalName);
          return {
            hospitalId: match?.hospitalId,
            name: x.hospitalName,
            location: match?.location ?? '',
          };
        });

        setRecents(recentHospitals);
      } catch (e) {
        console.warn('최근 방문 병원 구성 실패:', e);
      }
    })();
  }, [pet?.petId, hospitals]);

  // 자동완성 디바운스
  const debouncedSearch = useMemo(() => {
    let t: any;
    return (q: string) => {
      clearTimeout(t);
      t = setTimeout(async () => {
        try {
          if (!q.trim()) {
            setSuggests([]);
            return;
          }
          const s = await autocompleteHospitals(q.trim());
          setSuggests(s);
        } catch (e) {
          console.warn('자동완성 실패:', e);
        }
      }, 250);
    };
  }, []);

  useEffect(() => { debouncedSearch(search); }, [search, debouncedSearch]);

  const handleHospitalClick = (h: { hospitalId?: number; name: string; location?: string }) => {
    navigate('/owner/home/vet', { state: { hospital: h, pet } });
  };

  return (
    <div className="min-h-screen pb-4">
      <BackHeader text="병원 선택" />
      <div className="px-7 py-6">
        <p className="p text-black mb-4 text-center">진료 받을 병원을 선택해주세요.</p>

        <SearchInput placeholder="병원명 혹은 병원 주소" value={search} onChange={setSearch} />

        {/* 최근 방문한 병원 */}
        <div className="mt-8">
          <h4 className="p text-black mb-3">최근 방문한 병원</h4>
          <div className="bg-gray-50 rounded-xl overflow-hidden">
            {recents.length === 0 && (
              <div className="p-4 text-gray-400">최근 방문한 병원이 없습니다.</div>
            )}
            {recents.map((h, i) => (
              <SearchListItem
                key={`${h.name}-${i}`}
                name={h.name}
                description={h.location ?? ''}
                onClick={() => handleHospitalClick(h)}
              />
            ))}
          </div>
        </div>

        {/* 자동완성 결과 */}
        {search.trim() && (
          <div className="mt-6">
            <h4 className="p text-black mb-3">검색 결과</h4>
            <div className="bg-gray-50 rounded-xl overflow-hidden">
              {suggests.length === 0 && (
                <div className="p-4 text-gray-400">검색 결과가 없습니다.</div>
              )}
              {suggests.map(s => (
                <SearchListItem
                  key={s.hospitalId}
                  name={s.name}
                  description={s.location}
                  onClick={() => handleHospitalClick(s)}
                />
              ))}
            </div>
          </div>
        )}

        {/* 전체 병원(참고용 목록) */}
        {!search.trim() && (
          <div className="mt-8">
            <h4 className="p text-black mb-3">병원 목록</h4>
            <div className="bg-gray-50 rounded-xl overflow-hidden">
              {hospitals.map(h => (
                <SearchListItem
                  key={h.hospitalId}
                  name={h.name}
                  description={h.location}
                  onClick={() => handleHospitalClick(h)}
                />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
