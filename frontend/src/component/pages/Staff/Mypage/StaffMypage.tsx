import React, { useEffect, useState } from 'react';
import '@/styles/main.css';
import SimpleHeader from '@/component/header/SimpleHeader';
import Input from '@/component/input/Input';
import Button from '@/component/button/Button';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '@/services/api/auth';
import { getStaffInfo, updateStaffInfo } from '@/services/api/Staff/staffmypage';
import type { StaffResponse, StaffRequest } from '@/types/Staff/staffmypageType';
import { motion } from 'framer-motion';


export default function StaffMypage() {
  const navigate = useNavigate(); // useNavigate 훅을 함수처럼 호출해야 합니다.

  const [loading, setLoading] = useState(true);
  // saving 상태 제거 - 수정 기능 없음
  const [error, setError] = useState<string | null>(null);

  const [staffName, setStaffName] = useState('');
  const [staffHospitalId, setStaffHospitalId] = useState(0); // 병원 ID 추가
  const handleLogout = async () => {
    await authAPI.logout();
    navigate(`/auth/`);
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const me: StaffResponse = await getStaffInfo(); // API 호출
        setStaffName(me?.name ?? '');
        setStaffHospitalId(me?.hospitalId ?? 0); //
      } catch (e) {
        console.error(e);
        setError('관계자 정보를 불러오지 못했습니다!');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // 수정 기능 제거 - 조회만 가능

  return (
    <>
      <SimpleHeader text="마이페이지" />
      <div className="flex flex-col gap-6 px-7 mt-11">
        <div>
          <Input
            id="name"
            label="관계자 이름"
            value={staffName}
            onChange={() => {}} // 변경 불가
            disabled={true} // 항상 비활성화 - 조회만 가능
          />
        </div>
        <div className="flex justify-center gap-2 mt-2 px-7">
          <motion.button
            className="h4 text-center text-gray-500 cursor-pointer"
            onClick={handleLogout}
            whileHover={{ scale: 1.05 }} // hover시 효과 추가
            transition={{ duration: 0.2 }}
          >
            로그 아웃
          </motion.button>
        </div>
      </div>
    </>
  );
}
