// src/types/Staff/staffhospitalType.ts
export interface StaffHospitalResponse {
  hospitalId: number; name: string; profile: string; location: string; contact: string;
}
export interface StaffHospitalRequest {
  name?: string; profile?: string; location?: string; contact?: string;
}
export type DayEng = 'MON'|'TUE'|'WED'|'THU'|'FRI'|'SAT'|'SUN';

export interface StaffWorkingHourDto {
  workingId?: number;
  day: DayEng;
  // 서버가 "18"/18/"09:00" 등으로 내려올 수 있어 유니온으로 수용
  startTime: string | number;
  endTime: string | number;
}

export interface StaffVetLite {
  vetId: number;
  name: string;
  workingHours?: StaffWorkingHourDto[];
}
