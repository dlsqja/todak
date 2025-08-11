export interface VetMyResponse {
  name: string;
  license: string;
  profile: string;
  photo?: string;
  hospitalCode?: string;
}

export interface VetUpdateRequest {
  // 서버 스키마 상 가능 필드들!
  name: string;
  license: string;
  profile: string;
  photo?: string;
}
