// src/types/Vet/vettreatmentType.ts

export interface Pet {
  age: number;
  gender: string;
  name: string;
  petId: number;
  photo: string;
  species: string;
  weight: number;
}
export type Species = 'DOG' | 'CAT' | 'OTHER';
export type Gender =
  | 'MALE'
  | 'FEMALE'
  | 'NON'
  | 'MALE_NEUTERING'
  | 'FEMALE_NEUTERING';

export interface VetOwnerMini {
  name: string;
  phone: string;
  birth?: string; // ISO date (선택)
}
// type = 2 비대면 리스트 조회 (수의사 진료기록)
export interface VetTreatment {
  treatmentId: number;
  reservationId: number;
  owner?: VetOwnerMini;   // 리스트에선 없을 수도 있으니 선택
  vetName?: string;
  pet: Pet;
  isCompleted: boolean;
  startTime: string;      // ISO or "YYYY-MM-DD HH:mm:ss"
  endTime: string;        // ISO or "YYYY-MM-DD HH:mm:ss"
  result?: string;
  aiSummary?: string;
}

export interface VetTreatmentDetail extends VetTreatment {}

// type = 0 비대면 진료 목록
export interface VetTreatmentListResponse {
  petInfo: Pet;
  endTime: string;
  isCompleted: boolean;
  reservationId: number;
  startTime: string;
  subject: string;
  treatementDate: string;
  treatmentId: number;
}
