// src/types/Vet/vettreatmentType.ts
export type VetSubject =
  | 'DENTAL' // 치과
  | 'DERMATOLOGY' // 피부과
  | 'ORTHOPEDICS' // 정형외과
  | 'OPHTHALMOLOGY'; // 안과

export interface VetTreatment {
  treatmentId: number;
  reservationId: number;
  vetId: number;
  petId: number;
  hospitalId: number;
  subject: VetSubject;
  isComplete: boolean;
  isSigned: boolean;
  startTime: string; // ISO or "YYYY-MM-DDTHH:mm:ss"
  endTime: string; // ISO or "YYYY-MM-DDTHH:mm:ss"
  result?: string;
  aiSummary?: string;

  // ⚠️ 백엔드가 추가로 보내줄 수도 있는 확장 필드(있으면 사용, 없으면 무시)
  petName?: string;
  petInfo?: string;
}

export interface VetTreatmentDetail extends VetTreatment {}

export interface Pet {
  age: number;
  gender: string;
  name: string;
  petId: number;
  photo: string;
  species: string;
  weight: number;
}

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
