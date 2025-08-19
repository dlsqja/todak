import React, { useEffect, useMemo, useState } from 'react';
import '@/styles/main.css';
import SimpleHeader from '@/component/header/SimpleHeader';
import SelectionDropdown from '@/component/selection/SelectionDropdown';
import StaffPaymentCard from '@/component/card/StaffPaymentCard';
import { subjectMapping } from '@/utils/subjectMapping';
import { speciesMapping } from '@/utils/speciesMapping';
import { toTimeRange } from '@/utils/timeMapping';

import { getStaffPayments, postStaffPay } from '@/services/api/Staff/staffpayment';
import type { StaffPayment } from '@/types/Staff/staffpaymentType';

import ModalOnLayout from '@/layouts/ModalLayout';
import ModalTemplate from '@/component/template/ModalTemplate';
import Button from '@/component/button/Button';

// ---------- helpers ----------
const pad2 = (n: number) => String(n).padStart(2, '0');
const hasTZ = (s: string) => /[zZ]|[+\-]\d{2}:?\d{2}$/.test(s);
const normalizeISOish = (s: string) => {
  let out = s.trim().replace(' ', 'T');
  out = out.replace(/(\.\d{3})\d+$/, '$1'); // 소수점 3자리까지만
  return out;
};
const parseServerDate = (s?: string | null): Date | null => {
  if (!s || typeof s !== 'string') return null;
  const isoish = normalizeISOish(s);
  const withTZ = hasTZ(isoish) ? isoish : `${isoish}Z`; // tz 없으면 UTC로
  const d = new Date(withTZ);
  return isNaN(d.getTime()) ? null : d;
};
const hhmmLocalFromServer = (s?: string | null) => {
  const d = parseServerDate(s);
  if (!d) return '';
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
};
const ymdLocalFromServer = (s?: string | null) => {
  const d = parseServerDate(s);
  if (!d) return '';
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
};

const formatKoreanDate = (ymd: string) => {
  if (!ymd) return '날짜 미정';
  const [y, m, d] = ymd.split('-').map((v) => parseInt(v, 10));
  if (!y || !m || !d) return ymd;
  return `${y}-${pad2(m)}-${pad2(d)}`;
};
// 진료 날짜키: startTime(로컬 변환) 우선, 없으면 reservationDay
const getDateKey = (p: StaffPayment): string => {
  const ymd = ymdLocalFromServer(p.startTime || '');
  return ymd || (p.reservationDay ?? '');
};
// 정렬용 ts
const getTs = (p: StaffPayment): number => {
  const d = parseServerDate(p.startTime || '');
  if (d) return d.getTime();
  if (p.reservationDay) {
    const [y, m, d2] = p.reservationDay.split('-').map((v) => parseInt(v, 10));
    const base = new Date(y, (m || 1) - 1, d2 || 1, 0, 0, 0, 0).getTime();
    const slotMs = (p.reservationTime ?? 0) * 30 * 60 * 1000;
    return base + slotMs;
  }
  return 0;
};
// 표시용 시간(HH:mm ~ HH:mm)
const getTimeText = (p: StaffPayment) => {
  const a = p.startTime ? hhmmLocalFromServer(p.startTime) : '';
  const b = p.endTime ? hhmmLocalFromServer(p.endTime) : '';
  if (a && b) return `${a} - ${b}`;
  if (a || b) return a || b;
  return toTimeRange(undefined as any, undefined as any, p.reservationTime as any) || '';
};
// 통화 포맷
const formatKRW = (v: number) => v.toLocaleString('ko-KR') + '원';

const DEBUG = true;

const paidOptions = [
  { value: 'ALL', label: '결제 상태(전체)' },
  { value: 'false', label: '결제 대기' },
  { value: 'true', label: '결제 완료' },
] as const;

export default function StaffPayment() {
  // 목록/필터
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<StaffPayment[]>([]);
  const [selectedPaid, setSelectedPaid] = useState<'ALL' | 'true' | 'false'>('ALL');
  const [selectedVet, setSelectedVet] = useState<string>('ALL');

  // 드롭다운 상태 관리
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // 입력 모달
  const [modalOpen, setModalOpen] = useState(false);
  const [current, setCurrent] = useState<StaffPayment | null>(null);
  const [amountInput, setAmountInput] = useState<string>('');
  const [saving, setSaving] = useState(false);

  // 1차 확인(결제할래?) 모달
  const [payConfirmOpen, setPayConfirmOpen] = useState(false);

  // 결제 완료 확인 모달
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmPayload, setConfirmPayload] = useState<{
    dateText: string;
    timeText: string;
    vet: string;
    petText: string;
    amount: number | null;
    paidAt: string;
  } | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const list = await getStaffPayments();
        if (!alive) return;

        const safeList = Array.isArray(list) ? list : [];
        setRows(safeList);

        if (DEBUG) {
          // console.groupCollapsed('[StaffPayment] fetched');
          // console.log('raw length:', safeList.length);
          const table = safeList.map((p) => {
            const rawDatePart = String(p.startTime ?? '').split(/[ T]/)[0] || '';
            const localYMD = getDateKey(p);
            return {
              paymentId: p.paymentId,
              startTime: p.startTime ?? '',
              endTime: p.endTime ?? '',
              completeTime: p.completeTime ?? '',
              reservationDay: p.reservationDay ?? '',
              reservationTime: p.reservationTime ?? '',
              rawDatePart,
              localYMD,
              timeText: getTimeText(p),
              ts: getTs(p),
              isCompleted: !!p.isCompleted,
              amount: p.amount ?? null,
              vet: p.vet?.name ?? '',
              pet: p.pet?.name ?? '',
              subject: p.subject ?? '',
            };
          });
          // console.table(table);
          (window as any)._staffPayments = safeList;
          // console.groupEnd();
        }
      } catch (e: any) {
        // console.error('[StaffPayment] fetch error:', e);
        if (!alive) return;
        setError(e?.response?.data?.message || e?.message || '결제 목록을 불러오지 못했어요.');
        setRows([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  // 수의사 드롭다운 옵션 (ALL + 유니크)
  const vetOptions = useMemo(() => {
    const uniq = new Map<string, string>();
    rows.forEach((r) => {
      const value = String(r.vet?.vetId ?? r.vet?.name ?? '');
      const label = r.vet?.name ?? '이름 미정';
      if (value) uniq.set(value, label);
    });
    return [{ value: 'ALL', label: '전체 수의사' }].concat(
      Array.from(uniq.entries()).map(([value, label]) => ({ value, label })),
    );
  }, [rows]);

  // "종류 | 나이세 | 과"
  const makeInfo = (p: StaffPayment) => {
    const rawSpecies = p.pet?.species ?? '';
    const speciesCand =
      (speciesMapping as any)[String(rawSpecies).toUpperCase()] ??
      (speciesMapping as any)[rawSpecies] ??
      rawSpecies;
    const speciesKo = speciesCand || '반려동물';
    const agePart = p.pet?.age != null ? `${p.pet?.age}세` : '';
    const rawSubject = p.subject ?? '진료';
    const subjectKo =
      (subjectMapping as any)[rawSubject as keyof typeof subjectMapping] || rawSubject;
    return [speciesKo, agePart, subjectKo].filter(Boolean).join(' | ');
  };

  // 필터 → 최신순 → 날짜별 그룹(로컬 날짜 기준)
  const grouped = useMemo(() => {
    let list = [...rows];
    if (selectedVet !== 'ALL') {
      list = list.filter((r) => String(r.vet?.vetId ?? r.vet?.name ?? '') === selectedVet);
    }
    if (selectedPaid !== 'ALL') {
      const want = selectedPaid === 'true';
      list = list.filter((r) => !!r.isCompleted === want);
    }
    list.sort((a, b) => getTs(b) - getTs(a));

    const map = new Map<string, StaffPayment[]>();
    for (const it of list) {
      const key = getDateKey(it) || '날짜 미정';
      const arr = map.get(key) ?? [];
      arr.push(it);
      map.set(key, arr);
    }

    const entries = Array.from(map.entries()).sort((a, b) => {
      const ka = a[0], kb = b[0];
      if (ka === '날짜 미정') return 1;
      if (kb === '날짜 미정') return -1;
      return kb.localeCompare(ka);
    });
    for (const [, arr] of entries) arr.sort((x, y) => getTs(y) - getTs(x));

    return entries as [string, StaffPayment[]][];
  }, [rows, selectedPaid, selectedVet]);

  // 카드 클릭 시: 완료 모달 또는 입력 모달
  const openConfirmModalFromItem = (p: StaffPayment) => {
    const dateText = formatKoreanDate(getDateKey(p));
    const timeText = getTimeText(p);
    const vet = p.vet?.name || '-';
    const petText = (p.pet?.name || '반려동물') + (makeInfo(p) ? ` (${makeInfo(p)})` : '');

    const paidAt = p.completeTime
      ? `${ymdLocalFromServer(p.completeTime)} ${hhmmLocalFromServer(p.completeTime)}`
      : '-';

    const amount = typeof p.amount === 'number' ? p.amount : null;

    const payload = { dateText, timeText, vet, petText, amount, paidAt };
    setConfirmPayload(payload);
    setConfirmOpen(true);
  };

  const onCardClick = (p: StaffPayment) => {
    if (p.isCompleted) {
      openConfirmModalFromItem(p);
    } else {
      setCurrent(p);
      setAmountInput(p.amount != null ? String(p.amount) : '');
      setModalOpen(true);
    }
  };

  // ===== 1차 확인(결제할래?) → 예 누르면 실제 결제 실행 =====
  const openPayConfirm = () => {
    const n = Number(String(amountInput).replace(/[^\d]/g, ''));
    if (!Number.isFinite(n) || n <= 0) {
      alert('올바른 금액(원)을 입력해주세요.');
      return;
    }
    if (!current) return;
    setPayConfirmOpen(true);
  };

  const performPayment = async () => {
    const n = Number(String(amountInput).replace(/[^\d]/g, ''));
    if (!Number.isFinite(n) || n <= 0 || !current) return;

    try {
      setSaving(true);
      await postStaffPay({ paymentId: current.paymentId, totalAmount: n } as any);

      const nowIso = new Date().toISOString();
      setRows((prev) =>
        prev.map((it) =>
          it.paymentId === current.paymentId
            ? { ...it, amount: n, isCompleted: true, completeTime: nowIso }
            : it
        )
      );

      const dateText = formatKoreanDate(getDateKey(current));
      const timeText = getTimeText(current);
      const vet = current.vet?.name || '-';
      const petText =
        (current.pet?.name || '반려동물') + (makeInfo(current) ? ` (${makeInfo(current)})` : '');
      const paidAt = `${ymdLocalFromServer(nowIso)} ${hhmmLocalFromServer(nowIso)}`;

      const payload = { dateText, timeText, vet, petText, amount: n, paidAt };
      setConfirmPayload(payload);

      // 모달 전환: 입력모달 닫고 → 1차확인 닫고 → 완료모달 열기
      setModalOpen(false);
      setPayConfirmOpen(false);
      setConfirmOpen(true);
    } catch (e) {
      // console.warn('[StaffPayment] postStaffPay failed. Local-only update…', e);

      const nowIso = new Date().toISOString();
      setRows((prev) =>
        prev.map((it) =>
          it.paymentId === current.paymentId
            ? { ...it, amount: n, isCompleted: true, completeTime: nowIso }
            : it
        )
      );

      const dateText = formatKoreanDate(getDateKey(current));
      const timeText = getTimeText(current);
      const vet = current.vet?.name || '-';
      const petText =
        (current.pet?.name || '반려동물') + (makeInfo(current) ? ` (${makeInfo(current)})` : '');
      const paidAt = `${ymdLocalFromServer(nowIso)} ${hhmmLocalFromServer(nowIso)}`;

      const payload = { dateText, timeText, vet, petText, amount: n, paidAt };
      setConfirmPayload(payload);

      setModalOpen(false);
      setPayConfirmOpen(false);
      setConfirmOpen(true);
    } finally {
      setSaving(false);
    }
  };

  // 모달 표시용(입력용)
  const modalDateText = current ? formatKoreanDate(getDateKey(current)) : '';
  const modalTime = current ? getTimeText(current) : '';
  const modalVet = current?.vet?.name || '-';
  const modalPetName = current?.pet?.name || '반려동물';
  const modalPetInfo = current ? makeInfo(current) : '';

  // 1차 확인 모달에서 보여줄 금액 포맷
  const amountPreview =
    Number.isFinite(Number(String(amountInput).replace(/[^\d]/g, '')))
      ? formatKRW(Number(String(amountInput).replace(/[^\d]/g, '')))
      : '-';

  return (
    <>
      <SimpleHeader text="결제 관리" />

      {/* 필터 */}
      <div className="px-7 mt-4 flex gap-3">
        <div className="flex-1">
          <SelectionDropdown
            options={vetOptions as any}
            value={selectedVet}
            onChange={(v) => setSelectedVet(v)}
            placeholder="수의사 선택"
            dropdownId="vetDropdown"
            activeDropdown={activeDropdown}
            setActiveDropdown={setActiveDropdown}
          />
        </div>
        <div className="flex-1">
          <SelectionDropdown
            options={paidOptions as any}
            value={selectedPaid}
            onChange={(v) => setSelectedPaid(v as any)}
            placeholder="결제 상태"
            dropdownId="paidDropdown"
            activeDropdown={activeDropdown}
            setActiveDropdown={setActiveDropdown}
          />
        </div>
      </div>

      {/* 리스트 */}
      <div className="px-7 mt-4">
        {loading ? (
          <p className="p text-gray-500">불러오는 중…</p>
        ) : error ? (
          <p className="p text-red-500">{error}</p>
        ) : grouped.length === 0 ? (
          <div className="flex items-center justify-center h-40">
            <p className="h4 text-gray-500">표시할 결제 건이 없습니다.</p>
          </div>
        ) : (
          grouped.map(([dateKey, items]) => (
            <div key={dateKey} className="mb-6 mt-1">
              <div className="flex justify-between items-center mb-3">
                <h4 className="h4 text-black">{formatKoreanDate(dateKey)}</h4>
                <h4 className="h4 text-black">{items.length}건</h4>
              </div>

              <div className="flex flex-col gap-3">
                {items.map((p) => {
                  const rawSubject = p.subject ?? '진료';
                  const deptKo =
                    (subjectMapping as any)[rawSubject as keyof typeof subjectMapping] ||
                    rawSubject ||
                    '진료';
                  return (
                    <StaffPaymentCard
                      key={p.paymentId}
                      vetName={`${p.vet?.name ?? ''} 수의사님`}
                      department={deptKo}
                      petName={p.pet?.name ?? '반려동물'}
                      petInfo={makeInfo(p)}
                      time={getTimeText(p)}
                      isPaid={!!p.isCompleted}
                      onClick={() => onCardClick(p)}   // 완료면 확인 모달, 아니면 입력 모달
                    />
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* 금액 입력 모달 */}
      {modalOpen && current && (
        <ModalOnLayout onClose={() => setModalOpen(false)}>
          <ModalTemplate title="결제 금액 입력" onClose={() => setModalOpen(false)}>
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-2xl px-4 py-3 space-y-3">
                <div>
                  <h4 className="h4 text-black m-0">진료 일자 및 시간</h4>
                  <p className="p text-black mt-1">
                    {[modalDateText, modalTime].filter(Boolean).join(' ') || '-'}
                  </p>
                </div>
                <div>
                  <h4 className="h4 text-black m-0">담당 수의사</h4>
                  <p className="p text-black mt-1">{modalVet}</p>
                </div>
                <div>
                  <h4 className="h4 text-black m-0">반려동물</h4>
                  <p className="p text-black mt-1">
                    {modalPetName} {modalPetInfo ? `(${modalPetInfo})` : ''}
                  </p>
                </div>
              </div>

              <div>
                <label className="p block text-black mb-1">결제 금액(원)</label>
                <input
                  type="number"
                  inputMode="numeric"
                  className="w-full h-12 bg-white border-1 rounded-[12px] border-gray-400 px-4 text-black"
                  placeholder="예) 35000"
                  value={amountInput}
                  onChange={(e) => setAmountInput(e.target.value)}
                />
              </div>

              <div className="flex gap-3">
                <Button color="gray" text="취소" onClick={() => setModalOpen(false)} />
                <Button
                  color="green"
                  text={saving ? '결제 중…' : '결제'}
                  onClick={openPayConfirm}
                />
              </div>
            </div>
          </ModalTemplate>
        </ModalOnLayout>
      )}

      {/* 1차 결제 확인 모달 */}
      {payConfirmOpen && current && (
        <ModalOnLayout onClose={() => setPayConfirmOpen(false)}>
          <ModalTemplate title="결제 확인" onClose={() => setPayConfirmOpen(false)}>
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-2xl px-4 py-3 space-y-3">
                <div>
                  <h4 className="h4 text-black m-0">결제 금액</h4>
                  <p className="p text-black mt-1">{amountPreview}</p>
                </div>
                <div>
                  <h4 className="h4 text-black m-0">진료 일자 및 시간</h4>
                  <p className="p text-black mt-1">
                    {[modalDateText, modalTime].filter(Boolean).join(' ') || '-'}
                  </p>
                </div>
                <div>
                  <h4 className="h4 text-black m-0">담당 수의사</h4>
                  <p className="p text-black mt-1">{modalVet}</p>
                </div>
                <div>
                  <h4 className="h4 text-black m-0">반려동물</h4>
                  <p className="p text-black mt-1">
                    {modalPetName} {modalPetInfo ? `(${modalPetInfo})` : ''}
                  </p>
                </div>
              </div>

              <p className="p text-black">정말 이 금액으로 결제하시겠습니까?</p>

              <div className="flex gap-3">
                <Button
                  color="gray"
                  text="취소"
                  onClick={() => setPayConfirmOpen(false)}
                />
                <Button
                  color="green"
                  text={saving ? '결제 중…' : '확정'}
                  onClick={performPayment}
                />
              </div>
            </div>
          </ModalTemplate>
        </ModalOnLayout>
      )}

      {/* 결제 완료 확인 모달 */}
      {confirmOpen && confirmPayload && (
        <ModalOnLayout onClose={() => setConfirmOpen(false)}>
          <ModalTemplate title="결제 완료" onClose={() => setConfirmOpen(false)}>
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-2xl px-4 py-3 space-y-3">
                <div>
                  <h4 className="h4 text-black m-0">진료 일자 및 시간</h4>
                  <p className="p text-black mt-1">
                    {[confirmPayload.dateText, confirmPayload.timeText].filter(Boolean).join(' ')}
                  </p>
                </div>
                <div>
                  <h4 className="h4 text-black m-0">담당 수의사</h4>
                  <p className="p text-black mt-1">{confirmPayload.vet}</p>
                </div>
                <div>
                  <h4 className="h4 text-black m-0">반려동물</h4>
                  <p className="p text-black mt-1">{confirmPayload.petText}</p>
                </div>
                <div className="pt-1">
                  <h4 className="h4 text-black m-0">결제 완료 시간</h4>
                  <p className="p text-black mt-1">{confirmPayload.paidAt}</p>
                </div>
                <div>
                  <h4 className="h4 text-black m-0">결제 금액</h4>
                  <p className="p text-black mt-1">
                    {confirmPayload.amount != null ? formatKRW(confirmPayload.amount) : '-'}
                  </p>
                </div>
              </div>

              <div className="flex justify-end">
                <Button color="green" text="확인" onClick={() => setConfirmOpen(false)} />
              </div>
            </div>
          </ModalTemplate>
        </ModalOnLayout>
      )}
    </>
  );
}
