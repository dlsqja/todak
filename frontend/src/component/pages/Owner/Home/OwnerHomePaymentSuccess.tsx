import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import BackHeader from '@/component/header/BackHeader';
import Button from '@/component/button/Button';
import apiClient from '@/plugins/axios';

export default function PaymentSuccessPage() {
  const navigate = useNavigate();
  const [sp] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [msg, setMsg] = useState('처리 중입니다…');

  useEffect(() => {
    const pgToken = sp.get('pg_token');
    (async () => {
      if (!pgToken) {
        setStatus('error');
        setMsg('인증 토큰(pg_token)이 없습니다.');
        return;
      }
      try {
        // 서버: 저장해둔 tid로 /v1/payment/approve 호출 → SID 발급/DB 저장
        await apiClient.post('/public/pay/regist/1', { pgToken });
        setStatus('success');
        setMsg('결제수단(정기결제 키) 등록이 완료되었습니다.');
      } catch (e: any) {
        console.error(e);
        setStatus('error');
        setMsg(e?.response?.data?.message ?? '등록에 실패했습니다. 다시 시도해주세요.');
      }
    })();
  }, [sp]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <BackHeader text="결제수단 등록" />
      <div className="px-7 py-6 flex-1">
        {status === 'loading' && <p className="text-gray-600">{msg}</p>}

        {status === 'success' && (
          <>
            <p className="text-green-700 font-medium">{msg}</p>
            <p className="text-sm text-gray-600 mt-2">마이페이지 &gt; 결제수단에서 등록 정보를 확인할 수 있어요.</p>
          </>
        )}

        {status === 'error' && (
          <>
            <p className="text-red-600 font-medium">{msg}</p>
            <p className="text-sm text-gray-600 mt-2">결제수단을 다시 등록하거나 다른 방법을 선택해주세요.</p>
          </>
        )}
      </div>

      <div className="px-6 pb-6">
        <Button color="green" text="확인" onClick={() => navigate('/owner/home/apply-complete')} />
      </div>
    </div>
  );
}
