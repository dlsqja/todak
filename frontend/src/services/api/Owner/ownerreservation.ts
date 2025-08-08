import apiClient from '@/plugins/axios';
import type { OwnerReservationList, ReservationDetail } from '@/types/Owner/ownerreservationType';

//  예약 목록 조회
export const getReservations = async (): Promise<OwnerReservationList[]> => {
  const response = await apiClient.get('/reservations/owner');
  console.log('allresponse:', response.data.data);
  return response.data.data;
};

//  예약 상세 조회
export const getReservationDetail = async (reservationId: number): Promise<ReservationDetail> => {
  const response = await apiClient.get(`/reservations/owner/${reservationId}`);
  console.log('detail:', response.data.data);
  return response.data.data;
};

// /**
//  * 🟡 반려인 예약 신청
//  * POST /reservations/owner
//  * FormData에는 { data: Blob(JSON), photo: File } 형식
//  */
// export const createReservation = async (
//   formData: FormData
// ): Promise<void> => {
//   await apiClient.post('/reservations/owner', formData, {
//     headers: { 'Content-Type': 'multipart/form-data' },
//   })
// }

// /**
//  * 🔴 반려인 예약 취소
//  * DELETE /reservations/owner/{reservation_id}
//  */
// export const deleteReservation = async (
//   reservationId: number
// ): Promise<void> => {
//   await apiClient.delete(`/reservations/owner/${reservationId}`)
// }
