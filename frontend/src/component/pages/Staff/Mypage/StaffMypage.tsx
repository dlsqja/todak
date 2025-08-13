import React, { useEffect, useState } from 'react';
import '@/styles/main.css';
import SimpleHeader from '@/component/header/SimpleHeader';
import Input from '@/component/input/Input';
import Button from '@/component/button/Button';
import { useNavigate } from 'react-router-dom';

import { getStaffInfo, updateStaffInfo } from '@/services/api/Staff/staffmypage';
import type { StaffResponse, StaffRequest } from '@/types/Staff/staffmypageType';

export default function StaffMypage() {
  const navigate = useNavigate(); // useNavigate 훅을 함수처럼 호출해야 합니다.

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [staffName, setStaffName] = useState('');
  const [staffHospitalId, setStaffHospitalId] = useState(0);  // 병원 ID 추가

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const me: StaffResponse = await getStaffInfo(); // API 호출로 staff 정보 가져오기
        setStaffName(me?.name ?? ''); // 가져온 이름을 상태에 저장
        setStaffHospitalId(me?.hospitalId ?? 0); // 가져온 병원 ID를 상태에 저장
      } catch (e) {
        console.error(e);
        setError('관계자 정보를 불러오지 못했습니다!');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSubmit = async () => {
    try {
      setSaving(true);
      setError(null);

      if (!staffName.trim()) {
        alert('관계자 성함을 입력해주세요');
        return;
      }

      // 수정된 정보 서버로 전송
      const updatedData: StaffRequest = {
        name: staffName.trim(),
        hospitalId: staffHospitalId,  // 병원 ID도 함께 전송
      };

      await updateStaffInfo(updatedData);

      alert('수정완료!');
      navigate('/staff/mypage'); // 수정 완료 후 마이페이지로 이동
    } catch (e) {
      console.error(e);
      setError('수정에 실패했습니다');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <SimpleHeader text="마이페이지" />
      <div className="flex flex-col gap-6 px-7 mt-11">
        <div>
          <Input
            id="name"
            label="관계자 이름"
            value={staffName}
            onChange={(e) => setStaffName(e.target.value)} // 이름 입력 시 상태 업데이트
            disabled={loading} // 로딩 중일 때는 수정 불가
          />
        </div>
        <div className="px-7">
          <Button text={saving ? '수정 중…' : '수정하기'} onClick={handleSubmit} color="green" />
        </div>
        <div className="flex justify-center gap-2 mt-2">
          <button className="h4 text-center text-gray-500 cursor-pointer">로그 아웃</button>
          <span className="text-gray-500"> | </span>
          <button className="h4 text-center text-gray-500 cursor-pointer">회원 탈퇴</button>
        </div>
      </div>
    </>
  );
}
