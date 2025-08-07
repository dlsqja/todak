export interface TreatmentResponse {
  treatmentId: number;
  reservationId: number;
  owner: {
    name: string;
    phone: string;
    birth: string;
  };
  vetName: string;
  pet: {
    petId: number;
    name: string;
    species: 'DOG' | 'CAT' | 'OTHER';
    photo: string;
    gender: 'MALE' | 'FEMALE' | 'NON';
    age: number;
  };
  isCompleted: boolean;
  startTime: string; // ISO 8601 datetime string
  endTime: string;   // ISO 8601 datetime string
  result: string;    // 수의사 입력 진단
  aiSummary: string; // AI 요약 진단
}
