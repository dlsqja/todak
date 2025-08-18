import apiClient from '@/plugins/axios';  // axios 인스턴스 가져오기
import type { StaffResponse, StaffRequest } from '@/types/Staff/staffmypageType'; // 타입 가져오기

// Staff 정보 조회
export const getStaffInfo = async (): Promise<StaffResponse> => {
  try {
    const response = await apiClient.get('/staff/mypage');
    return response.data;  
  } catch (error) {
    console.error('직원 정보 조회 실패:', error);
    throw error;
  }
};

// Staff 정보 수정
export const updateStaffInfo = async (staffData: StaffRequest): Promise<StaffResponse> => {
  try {
    const response = await apiClient.post('/staff/mypage', staffData);  
    return response.data; 
  } catch (error) {
    console.error('직원 정보 수정 실패:', error);
    throw error;
  }
};
