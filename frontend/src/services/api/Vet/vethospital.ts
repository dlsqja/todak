import apiClient from '@/plugins/axios';
import type { HospitalDetail, HospitalUpdateRequest } from '@/types/Vet/vethospitalType';

let warned404Once = false;

/** ✅ 내 병원 정보 조회: 404는 '미연결'로 간주해 null 반환 */
export const getHospitalMine = async (): Promise<HospitalDetail | null> => {
  const res = await apiClient.get('/hospitals', {
    // 404는 throw하지 않도록
    validateStatus: (s) => s < 500,
  });

  if (res.status === 404) {
    if (import.meta.env.DEV && !warned404Once) {
      console.warn('[getHospitalMine] 404: hospital not linked for this account');
      warned404Once = true; // 개발환경에서 한 번만 경고
    }
    return null;
  }

  if (res.status >= 400) {
    // 401/403 등은 명확히 에러로
    throw new Error(res.data?.message || '병원 조회 실패');
  }

  return (res.data?.data ?? res.data) as HospitalDetail;
};

/** 🟡 내 병원 정보 수정 (PATCH /hospitals) */
export const updateHospitalMine = async (payload: HospitalUpdateRequest): Promise<void> => {
  const body: Record<string, unknown> = {};
  (['name', 'profile', 'location', 'contact'] as const).forEach((k) => {
    if (payload[k] !== undefined) body[k] = payload[k];
  });

  await apiClient.patch('/hospitals', body);
};
