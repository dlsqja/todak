interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
  role: string;
}

interface KakaoLoginParams {
  code: string;
  role: string;
}

// 반려인 회원가입
interface OwnerSignup {
  name: string;
  phone: number;
  birth: number;
}

// 수의사 회원가입
interface VetSignup {
  hospital_code: number;
  name: string;
  license_number: number;
}

// 병원 관계자 회원가입
interface StaffSignup {
  hospital_code: number;
  name: string;
}

export type { KakaoLoginParams, LoginResponse, OwnerSignup, VetSignup, StaffSignup };
