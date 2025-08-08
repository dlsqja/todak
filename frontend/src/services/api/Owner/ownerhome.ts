import apiClient from '@/plugins/axios';
import type { HospitalPublic, HospitalSuggest, VetPublic } from '@/types/Owner/ownerhomeType';

// 병원 리스트
export const getPublicHospitals = async (): Promise<HospitalPublic[]> => {
  const res = await apiClient.get('/public/hospitals');
  return res.data?.data ?? [];
};

// 자동완성
export const autocompleteHospitals = async (keyword: string): Promise<HospitalSuggest[]> => {
  const res = await apiClient.get(`/public/autocomplete/${encodeURIComponent(keyword)}`);
  return res.data?.data ?? [];
};

// 특정 병원의 수의사 리스트 (+ 각 수의사의 workingHours 포함)
export const getVetsByHospitalId = async (hospitalId: number): Promise<VetPublic[]> => {
  const res = await apiClient.get(`/public/hospitals/${hospitalId}/vets`);
  // 서버가 이미 workingHours를 포함해 준다는 전제
  return res.data?.data ?? [];
};
