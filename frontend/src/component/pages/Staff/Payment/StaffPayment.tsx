import React, { useEffect, useMemo, useState } from 'react';
import '@/styles/main.css';

import SimpleHeader from '@/component/header/SimpleHeader';
import SelectionDropdown from '@/component/selection/SelectionDropdown';
import StaffPaymentCard from '@/component/card/StaffPaymentCard';

import type { StaffPayment } from '@/types/Staff/staffpaymentType';
import { subjectMapping } from '@/utils/subjectMapping';
import { speciesMapping } from '@/utils/speciesMapping';
import { toTimeRange } from '@/utils/timeMapping';
import { useNavigate } from 'react-router-dom';

// =========================
// 더미 데이터 (API 연동 전)
// =========================
const DUMMY_PAYMENTS: StaffPayment[] = [
  {
    paymentId: 1,
    isCompleted: false,
    amount: 30000,
    method: 'CARD',
    reservationId: 100,
    reservationDay: '2025-08-16',
    reservationTime: 18, // 09:00
    startTime: null,
    endTime: null,
    subject: 'DERMATOLOGY',
    pet: { name: '쿠우', species: 'DOG', age: 4 },
    vet: { vetId: 11, name: '김수의' },
    hospitalName: '행복동물병원',
  },
  {
    paymentId: 2,
    isCompleted: true,
    amount: 45000,
    method: 'CASH',
    reservationId: 101,
    reservationDay: '2025-08-16',
    reservationTime: 21, // 10:30
    startTime: '2025-08-16T10:30:00',
    endTime: '2025-08-16T11:00:00',
    subject: 'DENTAL',
    pet: { name: '미료', species: 'DOG', age: 2 },
    vet: { vetId: 12, name: '박치과' },
    hospitalName: '행복동물병원',
  },
  {
    paymentId: 3,
    isCompleted: false,
    amount: 38000,
    method: 'CARD',
    reservationId: 102,
    reservationDay: '2025-08-15',
    reservationTime: 34, // 17:00
    startTime: '2025-08-15 17:00:00',
    endTime: '2025-08-15 17:30:00',
    subject: 'OPHTHALMOLOGY',
    pet: { name: '구름이', species: 'CAT', age: 5 },
    vet: { vetId: 11, name: '김수의' },
    hospitalName: '행복동물병원',
  },
];

const paidOptions = [
  { value: 'ALL', label: '결제 상태(전체)' },
  { value: 'false', label: '결제 대기' },
  { value: 'true', label: '결제 완료' },
] as const;

export default function StaffPayment() {
  // 선택된 필터
  const [selectedPaid, setSelectedPaid] = useState<'ALL' | 'true' | 'false'>('ALL');
  const [selectedVet, setSelectedVet] = useState<string>('ALL');

  // 원본 데이터(추후 API로 교체)
  const [rows, setRows] = useState<StaffPayment[]>([]);
  const navigate = useNavigate();
  // 더미 로드
  useEffect(() => {
    // TODO: API 붙으면 여기서 getStaffPayments()로 교체
    setRows(DUMMY_PAYMENTS);
  }, []);

  // 수의사 드롭다운 옵션 구성 (ALL + 유니크)
  const vetOptions = useMemo(() => {
    const uniq = new Map<string, string>(); // value, label
    rows.forEach((r) => {
      const value = String(r.vet?.vetId ?? r.vet?.name ?? '');
      const label = r.vet?.name ?? '이름 미정';
      if (value) uniq.set(value, label);
    });
    return [{ value: 'ALL', label: '전체 수의사' }].concat(
      Array.from(uniq.entries()).map(([value, label]) => ({ value, label })),
    );
  }, [rows]);

  // "종류 | 나이세 | 과" (⚠️ ??와 || 혼용 회피)
  const makeInfo = (p: StaffPayment) => {
    const rawSpecies = p.pet?.species ?? '';
    let speciesKo = (speciesMapping as any)[rawSpecies];
    if (!speciesKo) speciesKo = rawSpecies || '반려동물';

    const agePart = p.pet?.age != null ? `${p.pet?.age}세` : '';

    const rawSubject = p.subject ?? '진료';
    const subjectKo =
      (subjectMapping as any)[rawSubject as keyof typeof subjectMapping] || rawSubject;

    return [speciesKo, agePart, subjectKo].filter(Boolean).join(' | ');
  };

  // 시간 문자열(기존 유틸 재사용)
  const getTimeText = (p: StaffPayment) => {
    return (
      toTimeRange(p.startTime as any, p.endTime as any, p.reservationTime as any) ||
      ''
    );
  };

  // 필터 + 정렬
  const filtered = useMemo(() => {
    let list = [...rows];

    // 1) 수의사 필터
    if (selectedVet !== 'ALL') {
      list = list.filter((r) => {
        const v = String(r.vet?.vetId ?? r.vet?.name ?? '');
        return v === selectedVet;
      });
    }

    // 2) 결제 상태 필터
    if (selectedPaid !== 'ALL') {
      const want = selectedPaid === 'true';
      list = list.filter((r) => !!r.isCompleted === want);
    }

    // 최신 날짜 우선 → 같은 날짜는 예약 슬롯 오름차순
    list.sort((a, b) => {
      const da = a.reservationDay ?? '';
      const db = b.reservationDay ?? '';
      if (da !== db) return db.localeCompare(da);
      return (a.reservationTime ?? 0) - (b.reservationTime ?? 0);
    });

    return list;
  }, [rows, selectedPaid, selectedVet]);

  return (
    <>
      <SimpleHeader text="결제 관리" />

      {/* 필터 영역 */}
      <div className="px-7 mt-4 flex gap-3">
        <div className="flex-1">
          <SelectionDropdown
            options={vetOptions as any}
            value={selectedVet}
            onChange={(v) => setSelectedVet(v)}
            placeholder="수의사 선택"
          />
        </div>
        <div className="flex-1">
          <SelectionDropdown
            options={paidOptions as any}
            value={selectedPaid}
            onChange={(v) => setSelectedPaid(v as any)}
            placeholder="결제 상태"
          />
        </div>
      </div>

      {/* 리스트 */}
      <div className="px-7 mt-4 space-y-3">
        {filtered.length === 0 ? (
          <div className="flex items-center justify-center h-40">
            <p className="h4 text-gray-500">표시할 결제 건이 없습니다.</p>
          </div>
        ) : (
          filtered.map((p) => {
            const deptKo =
              (subjectMapping as any)[p.subject as keyof typeof subjectMapping] ||
              p.subject ||
              '진료';
            return (
              <StaffPaymentCard
                vetName={`${p.vet?.name ?? ''} 수의사님`}
                department={deptKo}
                petName={p.pet?.name ?? '반려동물'}
                petInfo={makeInfo(p)}
                time={getTimeText(p)}
                isPaid={!!p.isCompleted}
                onClick={() =>
                  navigate(`/staff/payment/${p.paymentId}`, { state: { payment: p } })
                }
              />
            );
          })
        )}
      </div>
    </>
  );
}