// src/types/Owner/ownerpetType.ts

// 성별 타입
export type PetGender = 'MALE' | 'FEMALE' | 'NON' | 'MALE_NEUTERING' | 'FEMALE_NEUTERING';

// 종 타입
export type PetSpecies = 'DOG' | 'CAT' | 'OTHER';

// API 응답용 반려동물 타입
export interface Pet {
  petId: number;           // 반려동물 고유 ID
  pet_code?: string;        // 코드 등록 시만 존재
  name: string;            // 이름
  species: PetSpecies;     // 종(DOG, CAT, OTHER)
  photo: string;           // 이미지 URL
  gender: PetGender;       // 성별
  age: number;             // 나이
  weight: number;          // 체중
}

export interface PetRequest {
  name: string;
  species: PetSpecies;
  gender: PetGender;      
  age: number;
  weight: number;
}
