import apiClient from '@/plugins/axios';
import type { VetMyResponse, VetUpdateRequest } from '@/types/Vet/vetmypageType';

/** 🟢 수의사 내 정보 조회 (GET /vets/my) */
export const getVetMy = async (): Promise<VetMyResponse> => {
  const res = await apiClient.get('/vets/my');
  return res.data?.data ?? res.data;
};

/** 🟡 수의사 내 정보 수정 (POST /vets/my) */
export const updateVetMy = async (payload: VetUpdateRequest): Promise<void> => {
  await apiClient.post('/vets/my', payload); // license 반드시 들어가야 함!!!
};