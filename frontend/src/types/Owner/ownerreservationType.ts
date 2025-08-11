import type { OwnerResponse } from '@/types/Owner/ownermypageType';
import type { Pet } from '@/types/Owner/ownerpetType';

export interface OwnerReservationList {
  petResponse: PetResponse;
  reservations: ReservationsResponse[];
}

export interface PetResponse {
  age: number;
  gender: string;
  name: string;
  petId: number;
  photo: string;
  species: string;
}

export interface ReservationsResponse {
  hospitalName: string;
  reservationDay: string;
  reservationId: number;
  reservationTime: number;
  status: string;
  subject: string;
  vetName: string;
  isRevisit: boolean;
}

export interface ReservationDetail {
  description: string;
  hospitalName: string;
  reservationId: number;
  pet: Pet;
  photo: string;
  reservationDay: string;
  reservationTime: number;
  status: string;
  subject: string;
  vetName: string;
  isRevisit: boolean;
}

export type ReservationStatus = 'REQUESTED' | 'APPROVED' | 'REJECTED' | 'COMPLETED';

export interface CreateOwnerReservationData {
  petId: string;
  hospitalId: string;
  vetId?: string;
  subject: 'DENTAL' | 'OPHTHALMOLOGY' | 'ORTHOPEDICS' | 'DERMATOLOGY';
  description: string;
  reservationDay: string;   // YYYY-MM-DD
  reservationTime: number;  // 0~47 슬롯
  status: ReservationStatus; // ✅ 생성 시 필수
  isRevisit?: boolean;      // ✅ DB 컬럼 대비 (선택)
}

// ✅ 서버가 생성 후 무엇을 돌려주는지 스펙이 확정 안 되었으니 최소 형태만
export interface CreateOwnerReservationResponse {
  reservationId: number;
  status: string; // 'PENDING' | ... (서버 그대로 수용)
}