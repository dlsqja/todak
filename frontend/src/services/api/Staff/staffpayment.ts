import apiClient from '@/plugins/axios';
import type {
  RawStaffPayment,
  StaffPayment,
  StaffPayRequest,
} from '@/types/Staff/staffpaymentType';
import { mapStaffPayment } from '@/types/Staff/staffpaymentType';

/** 결제 건 조회 (해당 병원) - GET /staffs/pay/ */
export const getStaffPayments = async (): Promise<StaffPayment[]> => {
  const res = await apiClient.get('/staffs/pay/', {
    // 4xx는 메시지 확인을 위해 그대로 throw 하도록 기본 동작 유지
  });
  const raw: RawStaffPayment[] = res.data?.data ?? res.data ?? [];
  return Array.isArray(raw) ? raw.map(mapStaffPayment) : [];
};

/** 결제 진행 - POST /staffs/pay/ */
export const postStaffPay = async <TResp = unknown>(
  payload: StaffPayRequest,
): Promise<TResp> => {
  const res = await apiClient.post('/staffs/pay/', payload);
  return (res.data?.data ?? res.data) as TResp;
};
