import apiClient from '@/plugins/axios';
import type { OwnerReservationList, ReservationDetail, CreateOwnerReservationData, CreateOwnerReservationResponse } from '@/types/Owner/ownerreservationType';

//  예약 목록 조회
export const getReservations = async (): Promise<OwnerReservationList[]> => {
  const response = await apiClient.get('/reservations/owner');
  console.log('allresponse:', response.data.data);
  return response.data.data;
};

/**
 * 🟢 반려인 예약 상세 조회
 * GET /reservations/owner/{reservation_id}
 */
export const getReservationDetail = async (reservationId: number): Promise<ReservationDetail> => {
  const res = await apiClient.get(`/reservations/owner/${reservationId}`);
  return res.data?.data ?? res.data;
};


// 🟡 반려인 예약 신청 (FormData: { data: Blob(JSON), photo?: File })
export const createReservation = async (
  data: CreateOwnerReservationData,
  photo?: File | null
): Promise<CreateOwnerReservationResponse> => {
  const formData = new FormData();
  formData.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }));
  if (photo) formData.append('photo', photo);

  const res = await apiClient.post('/reservations/owner', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  // 서버 래핑 구조에 맞춰 반환
  return res.data?.data ?? res.data;
};

// 🔴 예약 취소 (필요 시 해제)
// export const deleteReservation = async (reservationId: number): Promise<void> => {
//   await apiClient.delete(`/reservations/owner/${reservationId}`);
// }