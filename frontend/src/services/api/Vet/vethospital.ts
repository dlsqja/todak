// src/services/api/Vet/vethospital.ts
import apiClient from '@/plugins/axios';
import type { HospitalDetail, HospitalUpdateRequest } from '@/types/Vet/vethospitalType';

const CANDIDATES = ['/hospitals', '/vets/my/hospital']; // 순서대로 시도

async function resolveHospitalMeUrl(): Promise<string | null> {
  // 캐시(필요시): 한 번 성공한 경로를 저장
  const cached = sessionStorage.getItem('HOSP_ME_URL');
  if (cached) return cached;

  for (const path of CANDIDATES) {
    const res = await apiClient.get(path, { validateStatus: s => s < 500 });
    if (res.status === 200) {
      sessionStorage.setItem('HOSP_ME_URL', path);
      return path;
    }
    if (res.status === 404) continue; // 다음 후보
  }
  return null;
}

/** 내 병원 정보 조회: 404는 null(미연결) */
export const getHospitalMine = async (): Promise<HospitalDetail | null> => {
  // 1) 캐시/탐색으로 엔드포인트 결정
  let endpoint = await resolveHospitalMeUrl();
  // 2) 실패했으면 기본 후보 첫 번째로 시도
  if (!endpoint) endpoint = CANDIDATES[0];

  const res = await apiClient.get(endpoint, { validateStatus: s => s < 500 });
  if (res.status === 404) return null;           // 병원 미연결
  return (res.data?.data ?? res.data) as HospitalDetail;
};

/** 내 병원 정보 수정: 탐색된 엔드포인트로 PATCH */
export const updateHospitalMine = async (payload: HospitalUpdateRequest): Promise<void> => {
  const body: Record<string, unknown> = {};
  (['name', 'profile', 'location', 'contact'] as const).forEach(k => {
    if (payload[k] !== undefined) body[k] = payload[k];
  });

  let endpoint = sessionStorage.getItem('HOSP_ME_URL') || CANDIDATES[0];
  let res = await apiClient.patch(endpoint, body, { validateStatus: s => s < 500 });

  if (res.status === 404 || res.status === 405) {
    // 다른 후보로 재시도
    const fallback = CANDIDATES.find(p => p !== endpoint)!;
    res = await apiClient.patch(fallback, body, { validateStatus: s => s < 500 });
    if (res.status >= 400) throw new Error('Update failed');
    sessionStorage.setItem('HOSP_ME_URL', fallback);
  } else if (res.status >= 400) {
    throw new Error('Update failed');
  }
};
