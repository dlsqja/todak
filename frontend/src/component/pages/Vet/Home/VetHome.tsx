// src/component/pages/Vet/VetHome.tsx
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '@/styles/main.css';
import OwnerTreatmentSimpleCard from '@/component/card/OwnerTreatmentSimpleCard';
import TreatmentSlideList from '@/component/card/TreatmentSlideList';
import { motion } from 'framer-motion'; // ✅ 추가

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
  petPhotoUrl: string;
  _sortMinutes: number;
};

export default function VetHome() {
  const navigate = useNavigate();

  const [me, setMe] = useState<VetMyResponse | null>(null);
  const [loadingMe, setLoadingMe] = useState(true);

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

  // ✅ 비대면 진료 예정 목록
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

        const seenRes = new Set<number>();
        const target = filtered.filter((it) => {
          const id = (it as any).reservationId;
          if (seenRes.has(id)) return false;
          seenRes.add(id);
          return true;
        });

        const rows = target.map((it) => {
          const pet = it.petInfo;
          const species = speciesMapping[pet.species as keyof typeof speciesMapping] ?? '반려동물';
          const gender = genderMapping[pet.gender as keyof typeof genderMapping] ?? '성별미상';
          const agePart = Number.isFinite(pet.age as number) ? `${pet.age}세` : '';
          const department = subjectMapping[it.subject as keyof typeof subjectMapping] ?? '진료';

          const timeLabel = reservationToHHmm(it.reservationTime) || '시간 미정';
          const sortMin = reservationToMinutes(it.reservationTime);

          const raw = pet.photo || '';
          const petPhotoUrl =
            /^https?:\/\//i.test(raw) || /^data:image\//i.test(raw)
              ? raw
              : `${(import.meta.env.VITE_PHOTO_URL ?? '').replace(/\/+$/, '')}/${String(raw).replace(/^\/+/, '')}`;

          return {
            id: it.reservationId,
            time: timeLabel,
            department,
            petName: pet.name,
            petInfo: [species, gender, agePart].filter(Boolean).join(' / '),
            petPhotoUrl,
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

  const [reviewData, setReviewData] = useState<VetTreatment[]>([]);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [modalPetPhotoUrl, setModalPetPhotoUrl] = useState<string | undefined>(undefined);

  const hasRealStartTime = (it: any): boolean => {
    const v = it?.startTime ?? it?.start_time;
    if (v == null) return false;
    if (typeof v === 'number') {
      if (v >= 0 && v <= 47) return false;
      const d = new Date(v);
      return !isNaN(d.getTime());
    }
    if (v instanceof Date) return !isNaN(v.getTime());
    const s = String(v).trim();
    if (!s) return false;
    if (toLocalHHmm(s as any)) return true;
    const norm = s.replace(' ', 'T').replace(/\.\d+$/, '');
    const d = new Date(norm);
    return !isNaN(d.getTime());
  };

  const getStartTs = (x: any): number => {
    const v = x?.startTime ?? x?.start_time;
    if (v == null) return Number.POSITIVE_INFINITY;
    if (typeof v === 'number') {
      if (v >= 0 && v <= 47) return Number.POSITIVE_INFINITY;
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
        const raw = (await getVetTreatments(2)) as any[];
        const seenTid = new Set<number>();
        const unique = raw.filter((x: any) => {
          const tid = Number(x?.treatmentId);
          if (!tid || seenTid.has(tid)) return false;
          seenTid.add(tid);
          return true;
        });
        const finalList = unique.filter(hasRealStartTime).sort((a: any, b: any) => getStartTs(a) - getStartTs(b));
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

    let pointerId: number | null = null;

    const onPointerDown = (e: PointerEvent) => {
      isDownXRef.current = true;
      movedXRef.current = false;
      startXRef.current = e.clientX;
      startScrollLeftRef.current = el.scrollLeft;
      setDraggingX(true);
      pointerId = e.pointerId;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDownXRef.current) return;
      const dx = e.clientX - startXRef.current;
      if (!movedXRef.current && Math.abs(dx) > DRAG_CLICK_THRESHOLD_X) {
        movedXRef.current = true;
        if (pointerId != null) el.setPointerCapture?.(pointerId);
      }
      if (movedXRef.current) {
        el.scrollLeft = startScrollLeftRef.current - dx;
        e.preventDefault();
      }
    };

    const endDrag = (e: PointerEvent) => {
      if (!isDownXRef.current) return;
      isDownXRef.current = false;
      setDraggingX(false);
      if (pointerId != null) el.releasePointerCapture?.(pointerId);
      pointerId = null;
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

  const openDetailModal = async (reservationId: number, fallbackPhoto?: string) => {
    setModalOpen(true);
    setModalLoading(true);
    setModalDetail(null);
    setModalPetPhotoUrl(fallbackPhoto);
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

  // 🔥 애니메이션 variants (아이템 스태거용)
  const containerFade = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };
  const fadeIn = (delay = 0) => ({ initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { delay, duration: 0.4 } });

  return (
    <motion.div
      className="pb-10"
      initial="initial"
      animate="animate"
      variants={containerFade}
      transition={{ duration: 0.5 }}
    >
      {/* 인사 헤더 */}
      <motion.h3 className="h3 mx-7 pt-13" {...fadeIn(0.1)}>
        {loadingMe ? (
          '수의사님 반갑습니다!'
        ) : (
          <>
            <span className="text-green-400">{me?.name ?? ''} 수의사님</span>
            <span>&nbsp;반갑습니다!</span>
          </>
        )}
      </motion.h3>

      <motion.h3 className="h3 mx-7 mb-2" {...fadeIn(0.2)}>
        어플 사용이 처음이신가요?
      </motion.h3>

      {/* 가이드 버튼 */}
      <motion.div
        onClick={() => navigate('/vet/home/guide')}
        className="h4 mx-7 px-6 py-2 rounded-full inline-block bg-green-300 hover:bg-green-400 text-green-100 cursor-pointer"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.3 }}
        whileTap={{ scale: 0.97 }}
      >
        <div className="flex items-center gap-3">
          비대면 진료 가이드 <FiChevronRight className="w-4 h-4" />
        </div>
      </motion.div>

      {/* 예정 목록 섹션 */}
      <motion.h3 className="mx-7 h3 mt-11" {...fadeIn(0.25)}>
        비대면 진료 예정 목록
      </motion.h3>

      <motion.div
        ref={hScrollRef}
        className={`overflow-x-auto overflow-visible snap-x snap-mandatory scroll-smooth hide-scrollbar mx-7 pt-3 pb-6 ${
          draggingX ? 'cursor-grabbing select-none' : 'cursor-grab'
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.3 }}
      >
        <div className="w-max flex gap-4 h-full p-3">
          {loadingList ? (
            <>
              <motion.div
                className="h-24 rounded-2xl bg-gray-100"
                style={{ width: CARD_WIDTH }}
                initial={{ opacity: 0.4 }}
                animate={{ opacity: 1 }}
                transition={{ repeat: Infinity, repeatType: 'reverse', duration: 0.8 }}
              />
              <motion.div
                className="h-24 rounded-2xl bg-gray-100"
                style={{ width: CARD_WIDTH }}
                initial={{ opacity: 0.4 }}
                animate={{ opacity: 1 }}
                transition={{ repeat: Infinity, repeatType: 'reverse', duration: 0.8, delay: 0.15 }}
              />
            </>
          ) : (
            reservationCards.map((r, i) => (
              <motion.div
                key={`${r.id}-${i}`}
                className="cursor-pointer"
                style={{ minWidth: CARD_WIDTH }}
                initial={{ opacity: 0, scale: 0.98, y: 6 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.25, delay: 0.3 + i * 0.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  if (movedXRef.current) return;
                  openDetailModal(r.id, r.petPhotoUrl);
                }}
              >
                <OwnerTreatmentSimpleCard
                  time={r.time}
                  department={r.department}
                  petName={r.petName}
                  petInfo={r.petInfo}
                />
              </motion.div>
            ))
          )}
        </div>
      </motion.div>

      {/* 기록 검토 섹션 */}
      <motion.h3 className="mx-7 h3" {...fadeIn(0.2)}>
        진료 기록 검토
      </motion.h3>
      <motion.div
        className="mx-7"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.3 }}
      >
        <TreatmentSlideList
          data={reviewData}
          loading={reviewLoading}
          onCardClick={(id) => navigate(`/vet/records/detail/${id}`)}
        />
      </motion.div>

      {modalOpen && (
        <VetReservationDetailModal
          onClose={() => setModalOpen(false)}
          detail={modalDetail}
          loading={modalLoading}
          fallbackPetPhoto={modalPetPhotoUrl}
        />
      )}
    </motion.div>
  );
}
