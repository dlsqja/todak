// src/api/auth.ts
import apiClient from '@/plugins/axios';
import type { LoginResponse, KakaoLoginParams, OwnerSignup, VetSignup, StaffSignup } from '@/types/auth';

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
    console.log('userData', userData);
    const response = await apiClient.post('/public/signup/owner', userData, {
      params: {
        authId: Number(authId),
      },
    });
    return response.data;
  },

  // vet 회원가입
  vetSignup: async (userData: VetSignup) => {
    const response = await apiClient.post('/public/signup/vet', userData);
    return response.data;
  },

  // staff 회원가입
  staffSignup: async (userData: StaffSignup) => {
    const response = await apiClient.post('/public/signup/staff', userData);
    return response.data;
  },

  // HTTP-only 쿠키는 서버에서 자동 설정되므로 클라이언트에서 저장할 필요 없음
  saveTokens: (accessToken?: string, refreshToken?: string) => {
    console.log('HTTP-only 쿠키로 토큰이 자동 저장됩니다.');
    // 서버에서 Set-Cookie 헤더로 HTTP-only 쿠키 설정
    // 클라이언트에서는 별도 저장 작업 불필요
  },

  // HTTP-only 쿠키는 JavaScript로 접근 불가
  getAccessToken: (): string | null => {
    console.log('HTTP-only 쿠키는 JavaScript로 접근할 수 없습니다.');
    return null; // HTTP-only 쿠키는 브라우저가 자동으로 처리
  },

  // 로그아웃 시 서버에 요청해서 쿠키 삭제
  clearTokens: async () => {
    try {
      // 서버에 로그아웃 요청을 보내서 쿠키 삭제
      await apiClient.post('/auth/logout');
      console.log('로그아웃 완료 - HTTP-only 쿠키 삭제됨');
    } catch (error) {
      console.error('로그아웃 중 오류:', error);
    }
  },
};
