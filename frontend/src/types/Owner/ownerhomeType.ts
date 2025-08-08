// 병원 공개 리스트 (/public/hospitals)
export interface HospitalPublic {
  hospitalId: number;
  name: string;
  profile?: string;
  location: string;  // 주소
  contact?: string;  // 전화 등
}

// 특정 병원 수의사 목록 (/public/hospitals/{hospital_id}/vets)
export interface VetPublic {
  vetId: number;
  name: string;
  profile?: string;
  photo?: string;
}

// 자동완성 결과 (/public/autocomplete/{keyword})
export interface HospitalSuggest {
  hospitalId: number;
  name: string;
  location: string;
}

// (선택) 병원 소속 수의사 근무시간 (/hospitals/working-hours)
export type DayKey = 'MON'|'TUE'|'WED'|'THU'|'FRI'|'SAT'|'SUN';
export interface WorkingHour {
  workingId: number;
  day: DayKey;
  startTime: string; // "HH:mm" 식으로 내려옴 (API 스키마는 byte지만 문자열 취급)
  endTime: string;
}
export interface VetWorkingHourResponse {
  vetId: number;
  workingHourResponseList: WorkingHour[];
}
