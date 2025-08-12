export interface HospitalDetail {
  hospitalId: number;
  name: string;
  code?: string;        // 병원 코드 필드(백엔드 명칭이 code/hospitalCode 중 하나일 수 있어요)
  hospitalCode?: string;
  location?: string;
  profile?: string;
  photo?: string;
}