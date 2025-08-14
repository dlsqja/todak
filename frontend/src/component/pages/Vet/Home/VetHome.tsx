// src/component/pages/Vet/VetHome.tsx
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '@/styles/main.css';
import OwnerTreatmentSimpleCard from '@/component/card/OwnerTreatmentSimpleCard';
import TreatmentSlideList from '@/component/card/TreatmentSlideList';

// 시간 유틸
import { toLocalHHmm, timeMapping } from '@/utils/timeMapping';

// 매핑 유틸
import { speciesMapping } from '@/utils/speciesMapping';
import { genderMapping } from '@/utils/genderMapping';
import { subjectMapping } from '@/utils/subjectMapping';

// API
import { getVetMy } from '@/services/api/Vet/vetmypage';
import { getVetTreatmentList, getVetTreatments, getVetTreatmentDetail } from '@/services/api/Vet/vettreatment';
import type { VetTreatmentListResponse, VetTreatment, VetTreatmentDetail } from '@/types/Vet/vettreatmentType';
import type { VetMyResponse } from '@/types/Vet/vetmypageType';

// 상세 모달
import VetReservationDetailModal from '@/component/pages/Vet/Treatment/VetReservationDetailModal';
import { getVetReservationDetail } from '@/services/api/Vet/vetreservation';
import { getStaffReservationDetail } from '@/services/api/Staff/staffreservation';
import type { StaffReservationItem } from '@/types/Staff/staffreservationType';
import { FiChevronRight } from 'react-icons/fi';

type CardRow = {
  id: number;
  time: string;
  department: string;
  petName: string;
  petInfo: string;
  _sortMinutes: number;
};

export default function VetHome() {
  const navigate = useNavigate();

  const [me, setMe] = useState<VetMyResponse | null>(null);
  const [loadingMe, setLoadingMe] = useState(true);

  // 모달 상태
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalDetail, setModalDetail] = useState<StaffReservationItem | null>(null);

  const CARD_WIDTH = 180;

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await getVetMy();
        if (!alive) return;
        setMe(res);
      } catch (e) {
        console.warn('[VetHome] getVetMy failed', e);
      } finally {
        if (alive) setLoadingMe(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const [reservationCards, setReservationCards] = useState<CardRow[]>([]);
  const [loadingList, setLoadingList] = useState(true);

  // ── 공통 헬퍼 ───────────────────────────────
  const toSlotIndex = (v: unknown): number | null => {
    if (typeof v === 'number') return Number.isFinite(v) ? v : null;
    const s = String(v ?? '');
    if (/^\d+$/.test(s)) return Number(s);
    return null;
  };

  const hasStarted = (startVal: unknown): boolean => {
    if (startVal == null) return false;
    if (typeof startVal === 'number') {
      // 슬롯(0~47)이면 미시작으로 간주, 그 외 숫자는 타임스탬프로 간주
      if (startVal >= 0 && startVal <= 47) return startVal > 0;
      const d = new Date(startVal);
      return !isNaN(d.getTime());
    }
    if (startVal instanceof Date) return !isNaN(startVal.getTime());
    const s = String(startVal).trim();
    if (!s) return false;
    if (/^\d+$/.test(s)) {
      const n = Number(s);
      if (n >= 0 && n <= 47) return n > 0;
      const d = new Date(n);
      if (!isNaN(d.getTime())) return true;
    }
    // 문자열(ISO/DB/HH:mm 등) → 유효 시간이면 시작된 것으로 간주
    return !!toLocalHHmm(s as any);
  };

  const reservationToHHmm = (val: unknown): string => {
    const slot = toSlotIndex(val);
    if (slot != null && slot >= 0 && slot <= 47 && timeMapping[slot]) return timeMapping[slot];
    return toLocalHHmm(val as any) || '';
  };

  const reservationToMinutes = (val: unknown): number => {
    const slot = toSlotIndex(val);
    if (slot != null && slot >= 0 && slot <= 47) return slot * 30;
    const hhmm = toLocalHHmm(val as any);
    if (hhmm) {
      const m = hhmm.match(/^(\d{2}):(\d{2})$/);
      if (m) {
        const h = Number(m[1]);
        const mm = Number(m[2]);
        if (Number.isFinite(h) && Number.isFinite(mm)) return h * 60 + mm;
      }
    }
    return Number.POSITIVE_INFINITY;
  };
  // ───────────────────────────────────────────

  // ✅ 비대면 진료 예정 목록 (예약 상세 호출 제거: 목록의 reservationTime 사용)
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoadingList(true);
        const list = await getVetTreatmentList();
        if (!alive) return;

        const filtered = ((list as VetTreatmentListResponse[]) || []).filter((it: any) => {
          const notStarted = !hasStarted(it.startTime);
          const notCompleted = it.isCompleted !== true;
          return notStarted && notCompleted;
        });

        // reservationId 중복 제거
        const seenRes = new Set<number>();
        const target = filtered.filter((it) => {
          const id = (it as any).reservationId;
          if (seenRes.has(id)) return false;
          seenRes.add(id);
          return true;
        });

        // 🔁 목록의 reservationTime으로 바로 라벨/정렬 생성
        const rows = target.map((it) => {
          const pet = it.petInfo;
          const species = speciesMapping[pet.species as keyof typeof speciesMapping] ?? '반려동물';
          const gender = genderMapping[pet.gender as keyof typeof genderMapping] ?? '성별미상';
          const agePart = Number.isFinite(pet.age as number) ? `${pet.age}세` : '';
          const department = subjectMapping[it.subject as keyof typeof subjectMapping] ?? '진료';

          const timeLabel = reservationToHHmm(it.reservationTime) || '시간 미정';
          const sortMin = reservationToMinutes(it.reservationTime);

          return {
            id: it.reservationId,
            time: timeLabel,
            department,
            petName: pet.name,
            petInfo: [species, gender, agePart].filter(Boolean).join(' / '),
            _sortMinutes: sortMin,
          } as CardRow;
        });

        rows.sort((a, b) => a._sortMinutes - b._sortMinutes);
        setReservationCards(rows);
      } catch (e) {
        console.warn('[VetHome] getVetTreatmentList failed:', e);
        setReservationCards([]);
      } finally {
        if (alive) setLoadingList(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // ✅ 진료 기록 검토 (리스트필터와 동일 파이프라인)
  const [reviewData, setReviewData] = useState<VetTreatment[]>([]);
  const [reviewLoading, setReviewLoading] = useState(false);

  // ⬇︎ 여기 두 함수만 더 “유연하게” 수정 (number/Date/문자열 모두 허용)
  const hasRealStartTime = (it: any): boolean => {
    const v = it?.startTime ?? it?.start_time;
    if (v == null) return false;
    if (typeof v === 'number') {
      if (v >= 0 && v <= 47) return false; // 슬롯 숫자는 ‘시작시간’ 아님
      const d = new Date(v);
      return !isNaN(d.getTime());
    }
    if (v instanceof Date) return !isNaN(v.getTime());
    const s = String(v).trim();
    if (!s) return false;
    // HH:mm/ISO/DB 문자열이면 toLocalHHmm 성공 시 ‘시작 있음’으로 처리
    if (toLocalHHmm(s as any)) return true;
    const norm = s.replace(' ', 'T').replace(/\.\d+$/, '');
    const d = new Date(norm);
    return !isNaN(d.getTime());
  };

  const getStartTs = (x: any): number => {
    const v = x?.startTime ?? x?.start_time;
    if (v == null) return Number.POSITIVE_INFINITY;
    if (typeof v === 'number') {
      if (v >= 0 && v <= 47) return Number.POSITIVE_INFINITY; // 슬롯 숫자는 제외
      const d = new Date(v);
      return isNaN(d.getTime()) ? Number.POSITIVE_INFINITY : d.getTime();
    }
    if (v instanceof Date) return isNaN(v.getTime()) ? Number.POSITIVE_INFINITY : v.getTime();
    const s = String(v).trim();
    if (!s) return Number.POSITIVE_INFINITY;
    const norm = s.replace(' ', 'T').replace(/\.\d+$/, '');
    const d = new Date(norm);
    return isNaN(d.getTime()) ? Number.POSITIVE_INFINITY : d.getTime();
  };

  useEffect(() => {
  let alive = true;
  (async () => {
    try {
      setReviewLoading(true);

      // type=2 리스트만 사용
      const raw = (await getVetTreatments(2)) as any[];

      // treatmentId 중복 제거
      const seenTid = new Set<number>();
      const unique = raw.filter((x: any) => {
        const tid = Number(x?.treatmentId);
        if (!tid || seenTid.has(tid)) return false;
        seenTid.add(tid);
        return true;
      });

      // startTime 없는(무효) 항목 제외 + 시작 시간순 정렬
      const finalList = unique
        .filter(hasRealStartTime)
        .sort((a: any, b: any) => getStartTs(a) - getStartTs(b));

      if (alive) setReviewData(finalList as VetTreatment[]);
    } catch (e) {
      console.warn('[VetHome] reviewData load failed:', e);
      if (alive) setReviewData([]);
    } finally {
      if (alive) setReviewLoading(false);
    }
  })();
  return () => {
    alive = false;
  };
}, []);

  // ── 가로 드래그 스크롤(예정 목록) ─────────────────────────
  const hScrollRef = useRef<HTMLDivElement>(null);
  const isDownXRef = useRef(false);
  const startXRef = useRef(0);
  const startScrollLeftRef = useRef(0);
  const movedXRef = useRef(false);
  const [draggingX, setDraggingX] = useState(false);
  const DRAG_CLICK_THRESHOLD_X = 5;

  useEffect(() => {
    const el = hScrollRef.current;
    if (!el) return;

    const onPointerDown = (e: PointerEvent) => {
      isDownXRef.current = true;
      movedXRef.current = false;
      startXRef.current = e.clientX;
      startScrollLeftRef.current = el.scrollLeft;
      setDraggingX(true);
      el.setPointerCapture?.(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDownXRef.current) return;
      const dx = e.clientX - startXRef.current;
      if (Math.abs(dx) > DRAG_CLICK_THRESHOLD_X) movedXRef.current = true;
      el.scrollLeft = startScrollLeftRef.current - dx;
      e.preventDefault(); // 텍스트 선택 방지
    };

    const endDrag = (e: PointerEvent) => {
      if (!isDownXRef.current) return;
      isDownXRef.current = false;
      setDraggingX(false);
      el.releasePointerCapture?.(e.pointerId);
    };

    el.addEventListener('pointerdown', onPointerDown, { passive: true });
    el.addEventListener('pointermove', onPointerMove);
    el.addEventListener('pointerup', endDrag);
    el.addEventListener('pointerleave', endDrag);
    el.addEventListener('pointercancel', endDrag);

    return () => {
      el.removeEventListener('pointerdown', onPointerDown);
      el.removeEventListener('pointermove', onPointerMove);
      el.removeEventListener('pointerup', endDrag);
      el.removeEventListener('pointerleave', endDrag);
      el.removeEventListener('pointercancel', endDrag);
    };
  }, []);
  // ─────────────────────────────────────────────────────────

  // 모달
  const openDetailModal = async (reservationId: number) => {
    setModalOpen(true);
    setModalLoading(true);
    setModalDetail(null);
    try {
      let res: StaffReservationItem | null = null;
      try {
        res = await getVetReservationDetail(reservationId);
      } catch {
        res = await getStaffReservationDetail(reservationId);
      }
      setModalDetail(res ?? null);
    } catch {
      setModalDetail(null);
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div>
      <h3 className="h3 mx-7 pt-13">
        {loadingMe ? (
          '수의사님 반갑습니다!'
        ) : (
          <>
            <span className="text-green-400">{me?.name ?? ''} 수의사님</span>
            <span>&nbsp;반갑습니다!</span>
          </>
        )}
      </h3>

      <h3 className="h3 mx-7 mb-2">어플 사용이 처음이신가요?</h3>
      <div
        onClick={() => navigate('/owner/home/guide')}
        className="h4 mx-7 px-6 py-2 rounded-full inline-block bg-green-300 hover:bg-green-400 text-green-100 cursor-pointer"
      >
        <div className="flex items-center gap-3">
          비대면 진료 가이드 <FiChevronRight className="w-4 h-4" />
        </div>
      </div>

      <h3 className="mx-7 h3 mt-11">비대면 진료 예정 목록</h3>
      <div
        ref={hScrollRef}
        className={`overflow-x-auto overflow-visible snap-x snap-mandatory scroll-smooth hide-scrollbar mx-7 pt-3 pb-6 ${
          draggingX ? 'cursor-grabbing select-none' : 'cursor-grab'
        }`}
      >
        <div className="w-max flex gap-4 h-full p-3">
          {loadingList ? (
            <>
              <div className="h-24 rounded-2xl bg-gray-100 animate-pulse" style={{ width: CARD_WIDTH }} />
              <div className="h-24 rounded-2xl bg-gray-100 animate-pulse" style={{ width: CARD_WIDTH }} />
            </>
          ) : (
            reservationCards.map((r, i) => (
              <div
                key={`${r.id}-${i}`}
                className="cursor-pointer"
                style={{ minWidth: CARD_WIDTH }}
                onClick={() => {
                  if (movedXRef.current) return;
                  openDetailModal(r.id);
                }}
              >
                <OwnerTreatmentSimpleCard
                  time={r.time}
                  department={r.department}
                  petName={r.petName}
                  petInfo={r.petInfo}
                />
              </div>
            ))
          )}
        </div>
      </div>

      <h3 className="mx-7 h3">진료 기록 검토</h3>
      <div className="mx-7">
        <TreatmentSlideList
          data={reviewData}
          loading={reviewLoading}
          onCardClick={(id) => navigate(`/vet/records/detail/${id}`)}
        />
      </div>

      {modalOpen && (
        <VetReservationDetailModal onClose={() => setModalOpen(false)} detail={modalDetail} loading={modalLoading} />
      )}
    </div>
  );
}
