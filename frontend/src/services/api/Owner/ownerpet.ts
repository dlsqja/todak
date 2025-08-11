// src/api/Owner/ownerpet.ts
import apiClient from '@/plugins/axios';
import axios from 'axios';

// 1. 반려동물 목록 조회
export const getMyPets = async () => {

const res = await apiClient.get('/pets');
  console.log('🐶 API 응답:', res.data);
  return res.data.data;
};

// 2. 반려동물 상세 조회
export const getPetDetail = async (petId) => {
  const res = await apiClient.get(`/pets/${petId}`);
  return res.data;
};

// 3. 반려동물 등록 (multipart/form-data)
export const registerPet = async ({ petRequest, photo }) => {
  const formData = new FormData();

  console.log('petRequest:', petRequest);

  formData.append(
    'petRequest',
    new Blob([JSON.stringify(petRequest)], { type: 'application/json' })
  );

  if (photo) {
    formData.append('photo', photo);
  }

  // 확인용 로그
  for (const [key, value] of formData.entries()) {
    console.log(`${key}:`, value);
  }
  console.log('formData', formData);
  console.log('✅ baseURL 확인:', apiClient.defaults.baseURL);

  // 요청 경로 수정: /owner/pets로 변경
  const res = await apiClient.post('/pets', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return res.data;
};


// 4. 반려동물 수정 (multipart/form-data)
export const updatePet = async ({ id, petRequest, photo }) => {
  const formData = new FormData();

  formData.append(
    'petRequest',
    new Blob([JSON.stringify(petRequest)], { type: 'application/json' })
  );

  if (photo) {
    formData.append('photo', photo);
  }

  const res = await apiClient.patch(`/pets/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return res.data;
};



// 5. 반려동물 코드 등록
export const registerPetByCode = async (petCode) => {
  const res = await axios.post('/pets/code', petCode, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return res.data;
};

// 반려동물 전체 목록 가져오기
export const getPets = async () => {
  const res = await apiClient.get('/pets');
  return res.data;
};

