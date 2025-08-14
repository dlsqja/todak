import apiClient from '@/plugins/axios';
import type {
  StaffReservationItem,
  StaffReservationQuery,
} from '@/types/Staff/staffreservationType';

/** 🟢 병원 예약 목록 조회 (옵션: 병원ID/필터) */
export const getStaffHospitalReservations = async (
  hospitalId?: number,
  query?: StaffReservationQuery
): Promise<StaffReservationItem[]> => {
  const res = await apiClient.get('/reservations/hospitals', {
    params: { hospitalId, ...(query ?? {}) },
  });
  return res.data?.data ?? res.data ?? [];
};

/** 🟢 예약 상세 조회 — GET /reservations/hospitals/{reservation_id} */
export const getStaffReservationDetail = async (
  reservationId: number
): Promise<StaffReservationItem> => {
  const res = await apiClient.get(`/reservations/hospitals/${reservationId}`);
  return res.data?.data ?? res.data;
};

/** 🟢 예약 승인 — PATCH /reservations/hospitals/approve/{reservation_id} */
export const approveStaffReservation = async (
  reservationId: number
): Promise<StaffReservationItem> => {
  const res = await apiClient.patch(`/reservations/hospitals/approve/${reservationId}`);
  return res.data?.data ?? res.data;
};

/** 🟢 예약 반려 — PATCH /reservations/hospitals/rejection/{reservation_id}  { reason } */
export const rejectStaffReservation = async (
  reservationId: number,
  reason: string
): Promise<void> => {
  await apiClient.patch(
    `/reservations/hospitals/rejection/${reservationId}`,
    { reason }
  );
};

