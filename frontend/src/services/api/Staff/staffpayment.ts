import apiClient from '@/plugins/axios';
import type { RawStaffPayment, StaffPayment, StaffPayRequest } from '@/types/Staff/staffpaymentType';
import { mapStaffPayment } from '@/types/Staff/staffpaymentType';

// ✅ 결제 건 목록 조회 (병원 별도 파라미터 없음)
export const getStaffPayments = async (): Promise<StaffPayment[]> => {
  const res = await apiClient.get('/staffs/pay'); // /payments/hospitals 아님!
  const raw: RawStaffPayment[] = res.data?.data ?? res.data ?? [];
  return Array.isArray(raw) ? raw.map(mapStaffPayment) : [];
};

// ✅ 결제 진행 (카카오)
export const postStaffPay = async <TResp = unknown>(
  payload: StaffPayRequest,
): Promise<TResp> => {
  // 서버 스펙: KakaoPayRequest { payment_id, total_amount }
  const body = {
    payment_id: payload.paymentId,
    total_amount: payload.totalAmount,
  };
  const res = await apiClient.post('/staffs/pay', body); // 끝에 슬래시( / ) 붙이지 마!
  return (res.data?.data ?? res.data) as TResp;
};
