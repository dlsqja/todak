// src/types/Staff/staffmypageType.ts

export interface StaffResponse {
  name: string;           // 직원 이름
  hospitalId: number;    // 병원 ID
  authId: number;        // 인증 ID
}

export interface StaffRequest {
  name: string;           // 직원 이름
  hospitalId: number;    // 병원 ID
}
