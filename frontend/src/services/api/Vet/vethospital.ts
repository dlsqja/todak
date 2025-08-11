import apiClient from '@/plugins/axios';
import type { HospitalDetail } from '@/types/Vet/vethospitalType';

// 병원 단건 조회: GET /hospitals/{id}
// (백엔드 경로가 다르면 여기 한 줄만 바꿔주면 됨!)
export const getHospitalById = async (hospitalId: number): Promise<HospitalDetail> => {
  const res = await apiClient.get(`/hospitals/${hospitalId}`);
  return res.data?.data ?? res.data;
};