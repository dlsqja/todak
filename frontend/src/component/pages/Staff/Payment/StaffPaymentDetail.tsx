import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import BackHeader from '@/component/header/BackHeader';
import SingleContent from '@/component/text/SingleContent';
import MultiContent from '@/component/text/MultipleContent';
import Button from '@/component/button/Button';
import StatusBadge from '@/component/state/StatusBadge';
import ModalOnLayout from '@/layouts/ModalLayout';
import ModalTemplate from '@/component/template/ModalTemplate';

import type { StaffPayment } from '@/types/Staff/staffpaymentType';
import { subjectMapping } from '@/utils/subjectMapping';
import { speciesMapping } from '@/utils/speciesMapping';
import { toTimeRange, timeMapping } from '@/utils/timeMapping';

type LocState = { payment?: StaffPayment };

const formatKRW = (v?: number) =>
  typeof v === 'number' ? v.toLocaleString('ko-KR') + '원' : '-';

export default function StaffPaymentDetail() {
  const navigate = useNavigate();
  const { paymentId } = useParams<{ paymentId: string }>();
  const { state } = useLocation() as { state?: LocState };

  // 더미 데이터이므로 목록에서 state로 전달된 값을 사용
  const [payment, setPayment] = useState<StaffPayment | null>(
    state?.payment ?? null
  );

  // 금액 입력 모달
  const [amountOpen, setAmountOpen] = useState(false);
  const [amountInput, setAmountInput] = useState<string>(
    payment?.amount != null ? String(payment.amount) : ''
  );

  // 안전 라벨
  const subjectKo = useMemo(() => {
    const raw = payment?.subject ?? '진료';
    const mapped = (subjectMapping as any)[raw as keyof typeof subjectMapping];
    return mapped || raw;
  }, [payment?.subject]);

  const speciesKo = useMemo(() => {
    const raw = payment?.pet?.species ?? '';
    const mapped = (speciesMapping as any)[raw as keyof typeof speciesMapping];
    return mapped || raw || '반려동물';
  }, [payment?.pet?.species]);

  const timeText = useMemo(() => {
    if (!payment) return '';
    const fromRange =
      toTimeRange(
        payment.startTime as any,
        payment.endTime as any,
        payment.reservationTime as any
      ) || '';
    if (fromRange) return `${payment.reservationDay ?? ''} ${fromRange}`;
    const slot = payment.reservationTime;
    const hhmm =
      typeof slot === 'number' ? (timeMapping as any)[slot] ?? '' : '';
    return `${payment.reservationDay ?? ''} ${hhmm}`;
  }, [payment]);

  // 액션: 금액 저장(더미 상태만 갱신)
  const saveAmount = () => {
    const n = Number(amountInput.replace(/[^\d]/g, ''));
    if (!Number.isFinite(n) || n <= 0) {
      alert('올바른 금액을 입력해주세요.');
      return;
    }
    setPayment((prev) => (prev ? { ...prev, amount: n } : prev));
    setAmountOpen(false);
  };

  // 액션: 결제 완료 처리(더미 상태만 갱신)
  const setPaid = () =>
    setPayment((prev) => (prev ? { ...prev, isCompleted: true } : prev));

  if (!payment) {
    return (
      <div>
        <BackHeader text="결제 상세" />
        <div className="px-7 py-6">
          <p className="p text-red-500">
            상세 데이터를 찾을 수 없어요.
            {paymentId ? ` (paymentId=${paymentId})` : ''}
          </p>
          <Button color="gray" text="목록으로" onClick={() => navigate(-1)} />
        </div>
      </div>
    );
  }

  return (
    <div>
      <BackHeader text="결제 상세" />

      <div className="px-7 py-6 space-y-6">
        {/* 상단 상태 배지 */}
        <div className="flex justify-between items-center">
          <h4 className="h4">결제 정보</h4>
          <StatusBadge type="payment" statusKey={payment.isCompleted ? 'true' : 'false'} />
        </div>

        {/* 결제 요약 */}
        <MultiContent
          title=""
          contents={[
            `병원 : ${payment.hospitalName ?? '-'}`,
            `수의사 : ${payment.vet?.name ?? '-'}`,
            `과목 : ${subjectKo}`,
            `예약/진료 시간 : ${timeText || '-'}`,
          ]}
        />

        {/* 반려동물/보호자 관련 */}
        <MultiContent
          title="반려동물"
          contents={[
            `이름 : ${payment.pet?.name ?? '-'}`,
            `종 : ${speciesKo}`,
            payment.pet?.age != null ? `나이 : ${payment.pet?.age}세` : '',
          ].filter(Boolean) as string[]}
        />

        {/* 금액/방법 */}
        <SingleContent
          title="결제 금액"
          content={formatKRW(payment.amount)}
        />
        <SingleContent
          title="결제 수단"
          content={payment.method ?? '-'}
        />

        {/* 액션 버튼 */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          <Button
            color="lightgreen"
            text="금액 입력/수정"
            onClick={() => {
              setAmountInput(payment.amount != null ? String(payment.amount) : '');
              setAmountOpen(true);
            }}
          />
          <Button
            color="green"
            text={payment.isCompleted ? '결제 완료됨' : '결제 완료 처리'}
            onClick={payment.isCompleted ? undefined : setPaid}
            disabled={payment.isCompleted}
          />
        </div>
      </div>

      {/* 금액 입력 모달 */}
      {amountOpen && (
        <ModalOnLayout onClose={() => setAmountOpen(false)}>
          <ModalTemplate title="결제 금액 입력" onClose={() => setAmountOpen(false)}>
            <div className="space-y-3">
              <label className="p block text-black">금액(원)</label>
              <input
                type="number"
                inputMode="numeric"
                className="w-full h-12 bg-white border-1 rounded-[12px] border-gray-400 px-4 text-black"
                placeholder="예) 35000"
                value={amountInput}
                onChange={(e) => setAmountInput(e.target.value)}
              />
              <div className="flex gap-3 mt-2">
                <Button color="gray" text="취소" onClick={() => setAmountOpen(false)} />
                <Button color="green" text="저장" onClick={saveAmount} />
              </div>
            </div>
          </ModalTemplate>
        </ModalOnLayout>
      )}
    </div>
  );
}
