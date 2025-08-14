import apiClient from '@/plugins/axios';
import type { HospitalPublic, HospitalSuggest, VetPublic } from '@/types/Owner/ownerhomeType';

/** 공통 언랩퍼: data 래퍼가 있으면 쓰고, 없으면 본문 그대로 */
const unwrap = <T>(res: any, fallback: T): T => (res?.data?.data ?? res?.data ?? fallback);

/** 안전 숫자 변환(0~47 슬롯) */
const coerceSlot = (v: any): number => {
  if (typeof v === 'number' && Number.isFinite(v)) return v;
  if (typeof v === 'string') {
    const n = Number(v);
    if (Number.isFinite(n)) return n;
    try {
      // 혹시 base64로 올 경우까지 보험
      const n2 = Number(atob(v));
      if (Number.isFinite(n2)) return n2;
    } catch {}
  }
  return 0;
};

/** 병원 리스트 */
export const getPublicHospitals = async (): Promise<HospitalPublic[]> => {
  const res = await apiClient.get('/public/hospitals');
  return unwrap<HospitalPublic[]>(res, []);
};

/** 자동완성 (쿼리 파라미터) + 요청 취소 지원 */
export const autocompleteHospitals = async (
  keyword: string,
  opts?: { signal?: AbortSignal }
): Promise<HospitalSuggest[]> => {
  const res = await apiClient.get('/public/autocomplete', {
    params: { keyword },
    signal: opts?.signal,
  });
  return unwrap<HospitalSuggest[]>(res, []);
};

/** 수의사 리스트(근무시간 숫자화) */
export const getVetsByHospitalId = async (hospitalId: number): Promise<VetPublic[]> => {
  const res = await apiClient.get(`/public/hospitals/${hospitalId}/vets`);
  const raw = unwrap<any[]>(res, []);
  return raw.map((v) => ({
    ...v,
    workingHours: (v.workingHours ?? []).map((w: any) => ({
      ...w,
      // 0~47 숫자 보장
      startTime: coerceSlot(w?.startTime),
      endTime: coerceSlot(w?.endTime),
    })),
  }));
};

/** 수의사 불가능 시간 조회 (Owner 전용 공개 엔드포인트) */
export const getVetClosingHours = async (vetId: number): Promise<number[]> => {
  const res = await apiClient.get(`/public/${vetId}/closing-hours`);
  const arr = unwrap<any[]>(res, []);
  return arr.map(coerceSlot);
};
