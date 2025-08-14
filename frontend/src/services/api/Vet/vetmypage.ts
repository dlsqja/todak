import apiClient from '@/plugins/axios';
import type { VetMyResponse } from '@/types/Vet/vetmypageType';

/** 🟢 수의사 내 정보 조회 (GET /vets/my) */
export const getVetMy = async (): Promise<VetMyResponse> => {
  const res = await apiClient.get('/vets/my');
  return res.data?.data ?? res.data;
};

/** 🟡 수의사 내 정보 수정 (POST /vets/my) - multipart/form-data */
export const updateVetMy = async (formData: FormData): Promise<void> => {
  await apiClient.post('/vets/my', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
