// 공통 과목 타입
export type Subject =
  | 'DENTAL'
  | 'DERMATOLOGY'
  | 'ORTHOPEDICS'
  | 'OPHTHALMOLOGY'
  | string;

/** 서버 원본(snake_case)을 가장 안전하게 수용 */
export interface RawStaffPayment {
  payment_id: number;
  is_completed: number | boolean | '0' | '1';
  tid?: string | null;
  hospital_id: number;
  owner_id: number;
  treatment_id: number;

  // 선택 필드(조인/확장)
  amount?: number | null;
  method?: string | null;
  reservation_id?: number;
  reservation_day?: string;     // "YYYY-MM-DD"
  reservation_time?: number;    // 0~47
  start_time?: string | null;   // "YYYY-MM-DD HH:mm:ss[.SSSSSS]" | ISO
  end_time?: string | null;
  complete_time?: string | null; // ✅ 결제 완료 시간 (payment 테이블)
  subject?: Subject;
  pet?: { name: string; species?: string; age?: number };
  vet?: { vetId?: number; name?: string };
  hospital_name?: string;

  // 혹시 서버가 camelCase로 내려줄 가능성까지 방어
  paymentId?: number;
  isCompleted?: boolean;
  hospitalId?: number;
  ownerId?: number;
  treatmentId?: number;
  reservationId?: number;
  reservationDay?: string;
  reservationTime?: number;
  startTime?: string | null;
  endTime?: string | null;
  completeTime?: string | null; // ✅
  hospitalName?: string;
}

export interface StaffPayment {
  paymentId: number;
  isCompleted: boolean;
  tid?: string | null;
  hospitalId: number;
  ownerId: number;
  treatmentId: number;

  amount?: number | null;
  method?: string | null;
  reservationId?: number;
  reservationDay?: string;
  reservationTime?: number;
  startTime?: string | null;
  endTime?: string | null;
  completeTime?: string | null; // ✅
  subject?: Subject;
  pet?: { name: string; species?: string; age?: number };
  vet?: { vetId?: number; name?: string };
  hospitalName?: string;
}

/** 결제 요청 바디(프론트 내부 표현) */
export interface StaffPayRequest {
  paymentId: number;   // ✅ 서버는 payment_id
  totalAmount: number; // ✅ 서버는 total_amount
}

/** 원본 → 프론트 표준 형태 매퍼 */
export const mapStaffPayment = (r: RawStaffPayment): StaffPayment => {
  // snake/camel 혼재 방어
  const paymentId = (r.payment_id ?? r.paymentId) as number;
  const isCompletedRaw = r.is_completed ?? r.isCompleted;

  const toBool = (v: any) =>
    v === true || v === 1 || v === '1';

  return {
    paymentId: Number(paymentId),
    isCompleted: toBool(isCompletedRaw),
    tid: r.tid ?? null,
    hospitalId: Number(r.hospital_id ?? r.hospitalId),
    ownerId: Number(r.owner_id ?? r.ownerId),
    treatmentId: Number(r.treatment_id ?? r.treatmentId),

    amount: r.amount ?? null,
    method: r.method ?? null,
    reservationId: r.reservation_id ?? r.reservationId,
    reservationDay: r.reservation_day ?? r.reservationDay,
    reservationTime: r.reservation_time ?? r.reservationTime,
    startTime: (r.start_time ?? r.startTime) ?? null,
    endTime: (r.end_time ?? r.endTime) ?? null,
    completeTime: (r.complete_time ?? r.completeTime) ?? null, // ✅ 결제 완료 시간 매핑
    subject: r.subject,
    pet: r.pet,
    vet: r.vet,
    hospitalName: r.hospital_name ?? r.hospitalName,
  };
};
