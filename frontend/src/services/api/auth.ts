// src/api/auth.ts
import apiClient from '@/plugins/axios';
import type { LoginResponse, KakaoLoginParams, OwnerSignup, StaffSignup } from '@/types/auth';

export const authAPI = {
  // 카카오 로그인
  kakaoLogin: async (params: KakaoLoginParams): Promise<LoginResponse> => {
    const response = await apiClient.post(`/public/login/${params.role}`, {
      code: params.code,
    });
    return response.data;
  },

  // owner 회원가입
  ownerSignup: async (userData: OwnerSignup, authId: string) => {
    console.log('OwneruserData', userData);
    const response = await apiClient.post('/public/signup/owner', userData, {
      params: {
        authId: Number(authId),
      },
    });
    return response.data;
  },

  // vet 회원가입 (multipart/form-data)
  vetSignup: async (formData: FormData, authId: string) => {
    const response = await apiClient.post('/public/signup/vet', formData, {
      params: { authId: Number(authId) },
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // staff 회원가입
  staffSignup: async (userData: StaffSignup, authId: string) => {
    const response = await apiClient.post('/public/signup/staff', userData, {
      params: {
        authId: Number(authId),
      },
    });
    return response.data;
  },

  // 로그아웃
  logout: async () => {
    const response = await apiClient.post('/kakao/logout');
    return response.data;
  },
};
