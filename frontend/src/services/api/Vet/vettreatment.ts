import apiClient from '@/plugins/axios';
import type { VetTreatmentDetail, VetTreatmentListResponse } from '@/types/Vet/vettreatmentType';

/** 🟢 수의사 진료기록 목록 (GET /treatments/vets/history) */
export const getVetTreatments = async (type: 0 | 1 | 2 = 2): Promise<any[]> => {
  const res = await apiClient.get('/treatments/vets/history', { params: { type } });
  // console.log('res:', res);
  return res.data?.data ?? res.data ?? [];
};

/** 🟢 수의사 진료기록 상세 (GET /treatments/vets/details/{treatment_id}) */
export const getVetTreatmentDetail = async (treatmentId: number): Promise<VetTreatmentDetail> => {
  const res = await apiClient.get(`/treatments/vets/details/${treatmentId}`);
  return res.data?.data ?? res.data;
};

// 비대면 진료 목록 조회
export const getVetTreatmentList = async (): Promise<VetTreatmentListResponse[]> => {
  const res = await apiClient.get('/treatments/vets/history?type=0');
  // console.log('res:', res);
  return res.data?.data ?? res.data;
};

/** AI 요약 확인(서명) 처리 (PATCH /treatments/vets/complete/{treatment_id}) */
export const completeVetTreatment = async (treatmentId: number): Promise<void> => {
  await apiClient.patch(`/treatments/vets/complete/${treatmentId}`);
};

/** 진료 내용 수정 (POST /treatments/vets/{treatment_id}) — aiSummary만 받는 스펙 */
export const updateVetTreatment = async (
  treatmentId: number,
  payload: { aiSummary?: string }
): Promise<void> => {
  await apiClient.post(`/treatments/vets/${treatmentId}`, payload);
};
