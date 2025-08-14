// src/services/api/Staff/staffhospital.ts
import apiClient from '@/plugins/axios';
import type {
  StaffHospitalResponse,
  StaffHospitalRequest,
  StaffVetLite,
  DayEng,
} from '@/types/Staff/staffhospitalType';

/** 🟢 병원(내 소속) 정보 조회 — GET /hospitals */
export const getStaffHospitalDetail = async (): Promise<StaffHospitalResponse> => {
  const res = await apiClient.get('/hospitals');
  return res.data?.data ?? res.data;
};

/** 🟢 병원 정보 수정 — PATCH /hospitals */
export const updateStaffHospital = async (payload: StaffHospitalRequest): Promise<void> => {
  await apiClient.patch('/hospitals', payload);
};

/** 🟢 병원 소속 수의사 리스트 — GET /public/hospitals/{hospital_id}/vets */
export const getStaffVetsByHospital = async (hospitalId: number): Promise<StaffVetLite[]> => {
  const res = await apiClient.get(`/public/hospitals/${hospitalId}/vets`);
  const rows = res.data?.data ?? res.data ?? [];
  return rows.map((v: any) => ({
    vetId: v.vetId,
    name: v.name,
    // 서버 응답 그대로 보존 (startTime/endTime이 숫자/문자열 모두 가능)
    workingHours: (v.workingHours ?? []).map((h: any) => ({
      workingId: h.workingId,
      day: h.day,
      startTime: h.startTime,
      endTime: h.endTime,
    })),
  }));
};

/** 🟡 병원 소속 전체 근무시간 — GET /hospitals/working-hours
 *  (각 수의사별 workingHourResponseList 포함)
 */
export const getStaffVetsWithWorkingHours = async (): Promise<StaffVetLite[]> => {
  const res = await apiClient.get('/hospitals/working-hours');
  const rows = res.data?.data ?? res.data ?? [];
  return rows.map((vw: any) => ({
    vetId: vw.vetId,
    name: vw.name ?? vw.vetName ?? `수의사 ${vw.vetId}`,
    workingHours: (vw.workingHourResponseList ?? vw.workingHours ?? []).map((h: any) => ({
      workingId: h.workingId,
      day: h.day,
      startTime: h.startTime,
      endTime: h.endTime,
    })),
  }));
};

/** 🟢 수의사 근무시간 업서트 — PATCH /hospitals/{vet_id}/working-hours */
export const saveStaffVetWorkingHours = async (
  vetId: number,
  hours: Array<{
    workingId?: number;
    day: DayEng;
    startTime: number; // 0~47
    endTime: number; // 0~47
  }>,
): Promise<void> => {
  await apiClient.patch(`/hospitals/${vetId}/working-hours`, hours);
};

export const getPublicVetClosingHours = async (vetId: number): Promise<number[]> => {
  const res = await apiClient.get(`/public/${vetId}/closing-hours`);
  const rows = res.data?.data ?? res.data ?? [];
  return (rows as any[]).map((n) => Number(n)).filter((n) => Number.isFinite(n));
};

/** 🟢 특정 수의사의 예약 불가(클로징) 시간 등록 — POST /hospitals/{vet_id}/closing-hours
 *  Body: number[]  // 0~47 슬롯 배열
 */
export const postStaffVetClosingHours = async (vetId: number, slotIndexes: number[]): Promise<void> => {
  await apiClient.post(`/hospitals/${vetId}/closing-hours`, slotIndexes);
};
