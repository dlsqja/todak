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
  phone: string; // "010-1234-5678"
  birth: string; // "YYYY-MM-DD"
}

// 수의사 회원가입
interface VetSignup {
  name: string;
  license: string;
  hospitalCode: string;
  profile: string;
  photo: string;
}

// 병원 관계자 회원가입
interface StaffSignup {
  name: string;
  hospitalCode: string;
}

export type { KakaoLoginParams, LoginResponse, OwnerSignup, VetSignup, StaffSignup };
