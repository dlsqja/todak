// src/component/pages/Owner/Home/OwnerHomePaymentMethod.tsx

import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import BackHeader from '@/component/header/BackHeader';
import Button from '@/component/button/Button';
import { createReservation } from '@/services/api/Owner/ownerreservation';
import type { CreateOwnerReservationData } from '@/types/Owner/ownerreservationType';

export default function PaymentMethodPage() {
  const navigate = useNavigate();
  const { state } = useLocation() as {
    state?: { draft?: CreateOwnerReservationData; photo?: File | null };
  };

  const draft = state?.draft;
  const photo = state?.photo ?? null;

  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (!draft) {
      alert('신청 데이터가 없습니다. 처음부터 다시 진행해주세요!');
      return navigate(-1);
    }

    try {
      setLoading(true);
      await createReservation(draft, photo ?? undefined); // FormData: { data: Blob(JSON), photo?: File }
      navigate('/owner/home/apply-complete');
    } catch (e) {
      console.error(e);
      alert('신청에 실패했어요. 잠시 후 다시 시도해주세요!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <BackHeader text="결제 수단 선택" />

      <div className="px-7 py-6 flex-1 overflow-y-auto flex flex-col gap-6">
        <p>결제 API 내용</p>
        {/* 필요하면 디버깅용 드랩트 확인 */}
        {/* <pre className="text-xs text-gray-500">{JSON.stringify(draft, null, 2)}</pre> */}
      </div>

      {/* 하단 버튼 */}
      <div className="px-6">
        <Button
          color="green"
          text={loading ? '신청 중…' : '진료 신청하기'}
          onClick={handleClick}
        />
      </div>
    </div>
  );
}
