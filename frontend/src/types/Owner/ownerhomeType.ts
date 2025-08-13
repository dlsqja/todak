// 병원: /public/hospitals
export interface HospitalPublic {
  hospitalId: number;
  name: string;
  profile?: string;
  location: string;   // 주소
  contact?: string;
}

// 자동완성: /public/autocomplete/{keyword}
export interface HospitalSuggest {
  hospitalId: number;
  name: string;
  location: string;
}

// 요일/근무시간 공통
export type DayCode = 'MON'|'TUE'|'WED'|'THU'|'FRI'|'SAT'|'SUN';

export interface WorkingHourResponse {
  workingId: number;
  day: DayCode;
  startTime: number; // 0~47 (30분 인덱스)
  endTime: number;   // 0~47
}

// 수의사: /public/hospitals/{hospital_id}/vets
// ↑ 서버가 근무시간을 같이 내려주므로 필드 추가
export interface VetPublic {
  vetId: number;
  name: string;
  profile?: string;
  photo?: string;
  workingHours?: WorkingHourResponse[]; // <= 여기!
}
