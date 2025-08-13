import apiClient from '@/plugins/axios'
import type { OwnerRequest, OwnerResponse } from '@/types/Owner/ownermypageType'

/**
 * 반려인 마이페이지 정보 조회 (GET /owners/my)
 */
export const getOwnerInfo = async (): Promise<OwnerResponse> => {
  const response = await apiClient.get('/owners/my')
  return response.data.data
}

/**
 * 반려인 마이페이지 정보 수정 (PATCH /owners/my)
 */
export const updateOwnerInfo = async (data: OwnerRequest): Promise<void> => {
  const response = await apiClient.patch('/owners/my', data)
  // console.log(response)
  return response.data
}
