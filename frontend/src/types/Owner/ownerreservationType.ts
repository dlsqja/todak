import OwnerResponse from "@/types/Owner/ownermypageType"
import PetResponse from "@/types/Owner/ownerpetType"

export interface ReservationRequest {
  ownerId: number
  petId: number
  hospitalId: number
  vetId: number
  reservationDay: string
  reservationTime: number
  description: string
  subject: 'DENTAL' | 'DERMATOLOGY' | 'ORTHOPEDICS' | 'OPHTHALMOLOGY'
  status: 'REQUESTED' | 'APPROVED' | 'REJECTED' | 'COMPLETED'
}

export interface ReservationResponse {
  reservationId: number
  owner: OwnerResponse
  pet: PetResponse
  hospitalName: string
  vetName: string
  reservationDay: string
  reservationTime: number
  photo: string
  description: string
  subject: 'DENTAL' | 'DERMATOLOGY' | 'ORTHOPEDICS' | 'OPHTHALMOLOGY'
  status: 'REQUESTED' | 'APPROVED' | 'REJECTED' | 'COMPLETED'
}

export type ReservationListResponse = ReservationResponse[]
