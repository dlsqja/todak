// src/api/auth.ts
import apiClient from '@/plugins/axios';
import type { LoginResponse, KakaoLoginParams } from '@/types/auth';

export const authAPI = {
  // 카카오 로그인
  kakaoLogin: async (params: KakaoLoginParams): Promise<LoginResponse> => {
    const response = await apiClient.post(`/public/login/${params.role}`, {
      code: params.code,
    });
    return response.data;
  },

  // owner 회원가입
  ownerSignup: async (userData: { name: string; phone: string; birth: string }) => {
    const response = await apiClient.post('/public/signup/owner', userData);
    return response.data;
  },

  // 토큰 저장
  saveTokens: (accessToken: string, refreshToken?: string) => {
    localStorage.setItem('accessToken', accessToken);
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
  },

  // 토큰 가져오기
  getAccessToken: (): string | null => {
    return localStorage.getItem('accessToken');
  },

  // 토큰 삭제 (로그아웃)
  clearTokens: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },
};
