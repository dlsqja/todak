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
