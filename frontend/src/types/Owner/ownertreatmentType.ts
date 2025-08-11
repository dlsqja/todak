// src/types/Owner/ownertreatmentType.ts
import type { Pet } from '@/types/Owner/ownerpetType';

export type Subject = 'DENTAL' | 'DERMATOLOGY' | 'ORTHOPEDICS' | 'OPHTHALMOLOGY';
export interface OwnerTreatmentsByPet {
  petResponse: Pet; // 해당 펫 정보
  treatments: OwnerTreatmentItem[];
}
// 서버에서 /treatments/owner?type=1 에서 내려주는 구조
export interface OwnerTreatmentItem {
  reservationId: number;
  subject: string;
  reservationDay: string;
  vetName: string;
  hospitalName?: string;
  treatmentInfo: {
    // 서버가 이 철자로 내려줌(오타 포함)
    aiSummary: string;
    startTime: string; // ISO
    endTime: string; // ISO
  };
}

// 디테일 화면에서 쓰는 정규화된 타입 (필드 몇 개는 선택으로)
export interface TreatmentResponse {
  treatmentId: number; // = reservationId 로 맵핑
  reservation: {
    photo?: string;
    description?: string;
  };
  owner?: {
    name: string;
    phone: string;
    birth: string;
  };
  vetName: string;
  pet: Pet;
  hospitalName?: string;
  subject?: Subject;
  isCompleted?: boolean;
  startTime: string;
  endTime: string;
  result?: string;
  aiSummary: string;
}
