import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackHeader from '@/component/header/BackHeader';
import Button from '@/component/button/Button';
import apiClient from '@/plugins/axios';

export default function PaymentMethodPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const startZeroAuth = async () => {
    try {
      setLoading(true);
      const origin = window.location.origin;

      // 서버가 카카오페이 /v1/payment/ready를 "금액 0원"으로 호출해
      // next_redirect_pc_url(or mobile_url)을 redirectUrl로 내려준다고 가정
      const data = await apiClient.post('/owner/pay/ready', {
        successUrl: `${origin}/owner/home/payment/success`,
        cancelUrl: `${origin}/owner/home/payment/cancel`,
        failUrl: `${origin}/owner/home/payment/fail`,
      });

      console.log(data.data.data);
      const redirectUrl: string | undefined = data.data.data;
      if (!redirectUrl) throw new Error('redirectUrl 누락');

      // 카카오 결제창으로 이동(0원 인증)
      window.location.href = redirectUrl;
    } catch (err) {
      console.error(err);
      alert('카카오페이 연결에 실패했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 flex flex-col">
      <BackHeader text="결제수단 등록" />
      <div className="px-7 py-6 flex-1 overflow-y-auto flex flex-col gap-4">
        <h2 className="text-xl font-semibold">자동결제용 결제수단 등록</h2>
        <p className="text-gray-600 text-sm leading-6">
          최초 1회 0원 인증만 진행하고, 정기결제 키(SID)만 발급받습니다.
          <br />
          이후 결제는 등록된 SID로 자동으로 청구됩니다.
        </p>
      </div>

      <div className="px-6 pb-6">
        <Button
          color="green"
          text={loading ? '연결 중…' : '카카오페이로 인증'}
          onClick={startZeroAuth}
          disabled={loading}
        />
      </div>
    </div>
  );
}
