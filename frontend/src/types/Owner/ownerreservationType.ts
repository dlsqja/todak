import type OwnerResponse from "@/types/Owner/ownermypageType"
import type Pet from "@/types/Owner/ownerpetType"

export interface ReservationDetail {
  reservationId: number
  reservationDay: string
  reservationTime: number
  subject: 'DENTAL' | 'DERMATOLOGY' | 'ORTHOPEDICS' | 'OPHTHALMOLOGY'
  status: 'REQUESTED' | 'APPROVED' | 'REJECTED' | 'COMPLETED'
  photo: string | null
  description: string
  vetName: string
  hospitalName?: string
  owner?: OwnerResponse
  pet: Pet
}

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
}
