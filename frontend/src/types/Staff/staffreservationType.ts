// src/types/Staff/staffreservationType.ts
import type { genderMapping } from '@/utils/genderMapping';
import type { speciesMapping } from '@/utils/speciesMapping';
import type { subjectMapping } from '@/utils/subjectMapping';
import type { statusMapping } from '@/utils/statusMapping';

// 매핑 key를 타입으로!
export type Gender = keyof typeof genderMapping;          // 'MALE' | 'FEMALE' | ...
export type Species = keyof typeof speciesMapping;        // 'DOG' | 'CAT' | 'OTHER'
export type Subject = keyof typeof subjectMapping;        // 'DENTAL' | 'DERMATOLOGY' | ...
export type ReservationStatus = keyof typeof statusMapping; // 'REQUESTED' | 'APPROVED' | ...

export interface StaffReservationOwner {
  name: string;
  phone: string;
  birth: string; // YYYY-MM-DD
}

export interface StaffReservationPet {
  petId: number;
  name: string;
  species: Species;
  gender: Gender;
  photo?: string;
  age?: number;
  weight?: number;
}

/** 병원 예약 항목(리스트/상세 공용) */
export interface StaffReservationItem {
  reservationId: number;
  owner: StaffReservationOwner;
  pet: StaffReservationPet;
  hospitalName: string;
  vetName: string;
  vetId?: number;

  reservationDay: string;                 // 'YYYY-MM-DD'
  reservationTime: number | string;       // 0~47 슬롯 or 'HH:mm'
  subject: Subject;
  isRevisit: boolean;
  status: ReservationStatus;

  description?: string;
  photo?: string;
}

/** 리스트 조회용 선택 필터(있어도 되고 없어도 됨) */
export interface StaffReservationQuery {
  status?: ReservationStatus;
  reservationDay?: string; // 'YYYY-MM-DD'
}
