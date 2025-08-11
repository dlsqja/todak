// src/services/api/Owner/ownertreatment.ts
import apiClient from '@/plugins/axios';
import type { OwnerTreatmentsByPet, TreatmentResponse, OwnerTreatmentItem } from '@/types/Owner/ownertreatmentType';

// 비대면 진료 대기 목록
export const getTreatmentWaitingList = async (): Promise<OwnerTreatmentItem[]> => {
  const res = await apiClient.get('/treatments/owner?type=0');
  console.log('reswait:', res);
  return res.data?.data ?? [];
};
getTreatmentWaitingList();

// 비대면 진료 완료 목록
export const getTreatments = async () => {
  const res = await apiClient.get('/treatments/owner?type=1');
  console.log('rescomplete:', res);
  return res.data?.data ?? [];
};
getTreatments();

// 비대면 상세 목록
export const getTreatmentDetail = async (treatmentId: number) => {
  const buckets = await getTreatments();

  for (const bucket of buckets) {
    const t = bucket.treatments.find((x) => x.reservationId === treatmentId);
    if (!t) continue;

    // ✅ 오타/누락 모두 대비 (treatementInfo | treatmentInfo | 개별 필드)
    const info = (t as any).treatementInfo ?? (t as any).treatmentInfo ?? {};
    const startTime: string = info?.startTime ?? (t as any).startTime ?? '';
    const endTime: string = info?.endTime ?? (t as any).endTime ?? '';
    const aiSummary: string = info?.aiSummary ?? (t as any).aiSummary ?? '';

    return {
      treatmentId: t.reservationId,
      reservation: { photo: undefined, description: undefined }, // 목록엔 없음
      vetName: t.vetName ?? '',
      pet: bucket.petResponse,
      hospitalName: (t as any).hospitalName, // 없을 수도 있음
      subject: t.subject,
      startTime, // ← 빈 문자열일 수도 있음
      endTime,
      aiSummary,
    };
  }

  return null;
};
