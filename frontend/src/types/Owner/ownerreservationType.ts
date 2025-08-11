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
