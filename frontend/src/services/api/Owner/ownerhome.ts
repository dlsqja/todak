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

/** 병원 소속 수의사 리스트 - 퍼블릭 */
export const getVetsByHospitalId = async (hospitalId: number): Promise<VetPublic[]> => {
  const res = await apiClient.get(`/public/hospitals/${hospitalId}/vets`)
  return res.data?.data ?? res.data ?? []
}

/** ✅ 수의사 불가능 시간 조회(Owner 화면 전용) - 퍼블릭 엔드포인트 */
export const getVetClosingHours = async (vetId: number): Promise<number[]> => {
  const res = await apiClient.get(`/public/${vetId}/closing-hours`)
  // 응답: number[] (0~47 슬롯)
  return res.data?.data ?? res.data ?? []
}