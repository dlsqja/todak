export interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
  role: string;
}

export interface KakaoLoginParams {
  code: string;
  role: string;
}
