import apiClient from '@/plugins/axios'
import type { StaffReservationItem } from '@/types/Staff/staffreservationType'

// 🟢 예약 상세(수의사) — GET /reservations/vets/{reservation_id}
export const getVetReservationDetail = async (
  reservationId: number
): Promise<StaffReservationItem> => {
  const res = await apiClient.get(`/reservations/vets/${reservationId}`)
  return res.data?.data ?? res.data
}
