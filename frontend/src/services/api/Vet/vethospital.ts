// src/services/api/Vet/vethospital.ts
import apiClient from '@/plugins/axios';
import type { HospitalDetail, HospitalUpdateRequest } from '@/types/Vet/vethospitalType';

/** ✅ 내 병원 정보 조회: 404는 '미연결'로 간주 */
export const getHospitalMine = async (): Promise<HospitalDetail | null> => {
  const res = await apiClient.get('/hospitals', {
    // 404는 throw하지 않고 그대로 넘기게
    validateStatus: (s) => s < 500,
  });

  if (res.status === 404) {
    console.warn('[getHospitalMine] 404: hospital not linked for this account');
    return null;
  }
  // 2xx 이외(예: 401/403 등)에는 에러가 더 적절하다면 여기서 체크 가능
  if (res.status >= 400) {
    throw new Error(res.data?.message || '병원 조회 실패');
  }

  return res.data?.data ?? (res.data as HospitalDetail);
};

/** ✅ 내 병원 정보 수정 */
export const updateHospitalMine = async (payload: HospitalUpdateRequest): Promise<void> => {
  // undefined 필드는 보내지 않도록 정리
  const body: Record<string, unknown> = {};
  (['name', 'profile', 'location', 'contact'] as const).forEach((k) => {
    if (payload[k] !== undefined) body[k] = payload[k];
  });

  await apiClient.patch('/hospitals', body);
};
