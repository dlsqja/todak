import apiClient from '@/plugins/axios'
import type {
  ReservationRequest,
  ReservationResponse,
  ReservationListResponse,
} from '@/types/Owner/ownerreservationType'

/**
 * 🟢 반려인 예약 목록 조회
 * GET /reservations/owner
 */
export const getReservations = async (): Promise<ReservationListResponse> => {
  const response = await apiClient.get('/reservations/owner')
  return response.data.data;
}

/**
 * 🟢 반려인 예약 상세 조회
 * GET /reservations/owner/{reservation_id}
 */
export const getReservationDetail = async (
  reservationId: number
): Promise<ReservationResponse> => {
  const res = await apiClient.get(`/reservations/owner/${reservationId}`);
  return res.data?.data ?? res.data; // ← 래핑/비래핑 모두 대응
};

/**
 * 🟡 반려인 예약 신청
 * POST /reservations/owner
 * FormData에는 { data: Blob(JSON), photo: File } 형식
 */
export const createReservation = async (
  formData: FormData
): Promise<void> => {
  await apiClient.post('/reservations/owner', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

/**
 * 🔴 반려인 예약 취소
 * DELETE /reservations/owner/{reservation_id}
 */
export const deleteReservation = async (
  reservationId: number
): Promise<void> => {
  await apiClient.delete(`/reservations/owner/${reservationId}`)
}
