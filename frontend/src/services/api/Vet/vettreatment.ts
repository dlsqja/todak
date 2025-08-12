import apiClient from '@/plugins/axios';
import type { VetTreatmentListResponse } from '@/types/Vet/vettreatmentType';

// 비대면 진료 목록 조회
export const getVetTreatmentList = async (): Promise<VetTreatmentListResponse[]> => {
  const res = await apiClient.get('/treatments/vets/history?type=0');
  console.log('res:', res);
  return res.data?.data ?? res.data;
};

getVetTreatmentList();
