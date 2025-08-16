// src/services/api/Vet/vethospital.ts
import apiClient from '@/plugins/axios';
import type { HospitalDetail, HospitalUpdateRequest } from '@/types/Vet/vethospitalType';

/** ✅ 내 병원 정보 조회: 404는 "미연결"로 간주해 null 반환 */
export const getHospitalMine = async (): Promise<HospitalDetail | null> => {
  // 1차: /hospitals (신규 엔드포인트)
  const r1 = await apiClient.get('/hospitals', {
    // 404도 throw 하지 않음(5xx만 예외)
    validateStatus: (s) => s < 500,
  });
  if (r1.status === 200) return (r1.data?.data ?? r1.data) as HospitalDetail;
  if (r1.status !== 404) throw new Error(r1.data?.message || '병원 정보 조회 실패');

  // 2차 폴백: /vets/my/hospital (배포에서만 살아있는 경우 대비)
  const r2 = await apiClient.get('/vets/my/hospital', {
    validateStatus: (s) => s < 500,
  });
  if (r2.status === 200) return (r2.data?.data ?? r2.data) as HospitalDetail;

  // 둘 다 404면 미연결로 간주
  if (r2.status === 404) return null;
  throw new Error(r2.data?.message || '병원 정보 조회 실패');
};

/** 🟡 내 병원 정보 수정 (서버가 /hospitals만 받는 케이스 기준) */
export const updateHospitalMine = async (payload: HospitalUpdateRequest): Promise<void> => {
  // undefined 필드 제거
  const body: Record<string, unknown> = {};
  (['name', 'profile', 'location', 'contact'] as const).forEach((k) => {
    if (payload[k] !== undefined) body[k] = payload[k];
  });

  await apiClient.patch('/hospitals', body);
};
