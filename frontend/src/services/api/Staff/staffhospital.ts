// src/services/api/Staff/staffhospital.ts
import apiClient from '@/plugins/axios'
import type {
  StaffHospitalResponse,
  StaffHospitalRequest,
  StaffVetLite,
  DayEng,
} from '@/types/Staff/staffhospitalType'

/** 🟢 병원(내 소속) 정보 조회 — GET /hospitals */
export const getStaffHospitalDetail = async (): Promise<StaffHospitalResponse> => {
  const res = await apiClient.get('/hospitals') // 병원 정보 조회
  return res.data?.data ?? res.data
}

/** 🟢 병원 정보 수정 — PATCH /hospitals */
export const updateStaffHospital = async (payload: StaffHospitalRequest): Promise<void> => {
  // name/profile/location/contact 중 변경할 필드만 보내면 됨
  await apiClient.patch('/hospitals', payload)
}

/** 🟢 병원 소속 수의사 리스트 — GET /public/hospitals/{hospital_id}/vets */
export const getStaffVetsByHospital = async (hospitalId: number): Promise<StaffVetLite[]> => {
  const res = await apiClient.get(`/public/hospitals/${hospitalId}/vets`)
  const rows = res.data?.data ?? res.data ?? []
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
  }))
}

/** 🟢 수의사 근무시간 업서트 — PATCH /hospitals/{vet_id}/working-hours */
export const saveStaffVetWorkingHours = async (
  vetId: number,
  hours: Array<{
    workingId?: number
    day: DayEng
    startTime: number // 0~47
    endTime: number   // 0~47
  }>
): Promise<void> => {
  await apiClient.patch(`/hospitals/${vetId}/working-hours`, hours)
}
