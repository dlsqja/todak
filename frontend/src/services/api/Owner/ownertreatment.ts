// src/services/api/Owner/ownertreatment.ts
import apiClient from '@/plugins/axios';
import type { OwnerTreatmentsByPet, TreatmentResponse } from '@/types/Owner/ownertreatmentType';

export const getTreatments = async (): Promise<OwnerTreatmentsByPet[]> => {
  const res = await apiClient.get('/treatments/owner?type=1');
  return res.data?.data ?? [];
};

export const getTreatmentDetail = async (
  treatmentId: number
): Promise<TreatmentResponse | null> => {
  const buckets = await getTreatments();

  for (const bucket of buckets) {
    const t = bucket.treatments.find(x => x.reservationId === treatmentId);
    if (!t) continue;

    // ✅ 오타/누락 모두 대비 (treatementInfo | treatmentInfo | 개별 필드)
    const info = (t as any).treatementInfo ?? (t as any).treatmentInfo ?? {};
    const startTime: string =
      info?.startTime ?? (t as any).startTime ?? '';
    const endTime: string =
      info?.endTime ?? (t as any).endTime ?? '';
    const aiSummary: string =
      info?.aiSummary ?? (t as any).aiSummary ?? '';

    return {
      treatmentId: t.reservationId,
      reservation: { photo: undefined, description: undefined }, // 목록엔 없음
      vetName: t.vetName ?? '',
      pet: bucket.petResponse,
      hospitalName: (t as any).hospitalName, // 없을 수도 있음
      subject: t.subject,
      startTime,  // ← 빈 문자열일 수도 있음
      endTime,
      aiSummary,
    };
  }

  return null;
};
