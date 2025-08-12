import apiClient from '@/plugins/axios';
import type { HospitalDetail, HospitalUpdateRequest } from '@/types/Vet/vethospitalType';

/** 🟢 내 병원 정보 조회 (GET /hospitals) */
export const getHospitalMine = async (): Promise<HospitalDetail> => {
  const res = await apiClient.get('/hospitals');
  return res.data?.data ?? res.data;
};

/** 🟡 내 병원 정보 수정 (PATCH /hospitals) */
export const updateHospitalMine = async (payload: HospitalUpdateRequest): Promise<void> => {
  await apiClient.patch('/hospitals', payload);
};
