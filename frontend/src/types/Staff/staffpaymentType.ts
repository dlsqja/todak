// 결제 관련 공통 타입들

export type Subject =
  | 'DENTAL'
  | 'DERMATOLOGY'
  | 'ORTHOPEDICS'
  | 'OPHTHALMOLOGY'
  | string;

/** DB/백엔드 원본 필드(snake_case) */
export interface RawStaffPayment {
  payment_id: number;
  is_completed: number | boolean;  // 0/1 또는 boolean
  tid?: string | null;
  hospital_id: number;
  owner_id: number;
  treatment_id: number;

  // 선택(조인/확장 데이터가 있을 수 있음)
  amount?: number;
  method?: string;
  reservation_id?: number;
  reservation_day?: string;  // "YYYY-MM-DD"
  reservation_time?: number; // 0~47
  start_time?: string | null;
  end_time?: string | null;
  subject?: Subject;
  pet?: { name: string; species?: string; age?: number };
  vet?: { vetId?: number; name?: string };
  hospital_name?: string;
}

/** 프론트에서 쓰기 편한 camelCase */
export interface StaffPayment {
  paymentId: number;
  isCompleted: boolean;
  tid?: string | null;
  hospitalId: number;
  ownerId: number;
  treatmentId: number;

  // 선택(조인/확장)
  amount?: number;
  method?: string;
  reservationId?: number;
  reservationDay?: string;
  reservationTime?: number;
  startTime?: string | null;
  endTime?: string | null;
  subject?: Subject;
  pet?: { name: string; species?: string; age?: number };
  vet?: { vetId?: number; name?: string };
  hospitalName?: string;
}

/** 결제 수행 요청 바디 (스웨거에 KakaoPayRequest로 표기) */
export interface StaffPayRequest {
  treatmentId: number;  // 어떤 진료의 결제인지
  amount: number;       // 결제 금액
  method?: string;      // (선택) 결제수단 명시 필요시
}

/** 원본 → 프론트 표준 형태 매퍼 */
export const mapStaffPayment = (r: RawStaffPayment): StaffPayment => ({
  paymentId: Number(r.payment_id),
  isCompleted:
    r.is_completed === true ||
    r.is_completed === 1 ||
    r.is_completed === '1',
  tid: r.tid ?? null,
  hospitalId: Number(r.hospital_id),
  ownerId: Number(r.owner_id),
  treatmentId: Number(r.treatment_id),

  amount: r.amount,
  method: r.method,
  reservationId: r.reservation_id,
  reservationDay: r.reservation_day,
  reservationTime: r.reservation_time,
  startTime: r.start_time ?? null,
  endTime: r.end_time ?? null,
  subject: r.subject,
  pet: r.pet,
  vet: r.vet,
  hospitalName: r.hospital_name,
});
