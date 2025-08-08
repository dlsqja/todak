import apiClient from '@/plugins/axios';
import type {
  HospitalPublic,
  VetPublic,
  HospitalSuggest,
  VetWorkingHourResponse,
} from '@/types/Owner/ownerhomeType';

// 병원 리스트
export const getPublicHospitals = async (): Promise<HospitalPublic[]> => {
  const res = await apiClient.get('/public/hospitals');
  // 서버 응답이 {message, data} 형태라면 .data.data, 아니면 .data
  return res.data?.data ?? res.data;
};

// 특정 병원 수의사 리스트
export const getVetsByHospitalId = async (hospitalId: number): Promise<VetPublic[]> => {
  const res = await apiClient.get(`/public/hospitals/${hospitalId}/vets`);
  return res.data?.data ?? res.data;
};

// 병원 자동완성
export const autocompleteHospitals = async (keyword: string): Promise<HospitalSuggest[]> => {
  if (!keyword.trim()) return [];
  const res = await apiClient.get(`/public/autocomplete/${encodeURIComponent(keyword)}`);
  return res.data?.data ?? res.data;
};

// (선택) 병원 소속 수의사 근무시간
export const getHospitalWorkingHours = async (): Promise<VetWorkingHourResponse[]> => {
  const res = await apiClient.get('/hospitals/working-hours');
  return res.data?.data ?? res.data;
};
