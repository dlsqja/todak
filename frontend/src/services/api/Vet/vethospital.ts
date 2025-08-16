import apiClient from '@/plugins/axios';
import type { HospitalDetail, HospitalUpdateRequest } from '@/types/Vet/vethospitalType';

/** ✅ 내 병원 정보 조회: 404는 정상 케이스(null)로 반환 */
export const getHospitalMine = async (): Promise<HospitalDetail | null> => {
  try {
    const res = await apiClient.get('/hospitals'); // 배포에서 404 가능
    return (res.data?.data ?? res.data) as HospitalDetail;
  } catch (e: any) {
    const status = e?.response?.status;
    if (status === 404) {
      // 인터셉터가 404를 reject해도 여기서 흡수
      return null;
    }
    throw e; // 나머지는 그대로 에러
  }
};

/** ✅ 내 병원 정보 수정 */
export const updateHospitalMine = async (payload: HospitalUpdateRequest): Promise<void> => {
  const body: Record<string, unknown> = {};
  (['name', 'profile', 'location', 'contact'] as const).forEach((k) => {
    if (payload[k] !== undefined) body[k] = payload[k];
  });
  await apiClient.patch('/hospitals', body);
};
