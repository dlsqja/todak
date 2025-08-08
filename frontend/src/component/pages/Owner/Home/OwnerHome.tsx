// src/component/pages/Owner/Home/OwnerHome.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '@/styles/main.css';
import PetProfileCard from '@/component/card/PetProfileCard';
import { motion } from 'framer-motion';
import { getMyPets } from '@/services/api/Owner/ownerpet';
import type { Pet as ApiPet, PetGender } from '@/types/Owner/ownerpetType';

type CardPet = {
  id: number;
  name: string;
  genderText: string;
  breedAge: string;
  weight?: string;
  raw: ApiPet;
};

const speciesKo = { DOG: '강아지', CAT: '고양이', OTHER: '기타' } as const;
const genderToText = (g: PetGender) => {
  switch (g) {
    case 'MALE': return '남';
    case 'FEMALE': return '여';
    case 'MALE_NEUTERING': return '남(중성화)';
    case 'FEMALE_NEUTERING': return '여(중성화)';
    case 'NON':
    default: return '성별 없음';
  }
};

export default function OwnerHome() {
  const navigate = useNavigate();
  const [petList, setPetList] = useState<CardPet[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      try {
        const data: ApiPet[] = await getMyPets();
        setPetList((data ?? []).map(p => ({
          id: p.petId,
          name: p.name,
          genderText: genderToText(p.gender),
          breedAge: `${speciesKo[p.species]} ${p.age ?? 0}세`,
          weight: '-',
          raw: p,
        })));
      } catch (e) {
        console.warn('펫 목록 불러오기 실패:', e);
        setPetList([]);
      }
    })();
  }, []);

  const totalSlides = petList.length;

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const el = scrollRef.current;
    const itemWidth = el.getBoundingClientRect().width; // padding 영향 X
    const idx = Math.round(el.scrollLeft / itemWidth);
    // 여유/공백 스냅 방지
    const clamped = Math.max(0, Math.min(idx, Math.max(0, totalSlides - 1)));
    setCurrentIndex(clamped);
  };

  const scrollToIndex = (index: number) => {
    if (!scrollRef.current) return;
    const el = scrollRef.current;
    const itemWidth = el.getBoundingClientRect().width;
    const clamped = Math.max(0, Math.min(index, Math.max(0, totalSlides - 1)));
    el.scrollTo({ left: itemWidth * clamped, behavior: 'smooth' });
    setCurrentIndex(clamped);
  };

  const handlePetClick = (pet: CardPet) => {
    navigate('/owner/home/hospital', { state: { pet: pet.raw } });
  };

  return (
    <motion.div className="pb-10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <motion.h3 className="h3 mx-7 pt-13">ㅇㅇㅇ님 반가워요!</motion.h3>
      <motion.h3 className="h3 mx-7 mb-2">비대면 진료가 처음이신가요?</motion.h3>
      <motion.button onClick={() => navigate('/owner/home/guide')} className="h5 mx-7 px-5 py-1 rounded-full inline-block bg-green-300 text-green-100">
        비대면 진료 가이드
      </motion.button>

      <motion.h3 className="mx-7 h3 mt-11">비대면 진료 시작하기</motion.h3>

      {/* 슬라이더: 바깥에서만 좌우 padding, 슬라이드는 전체 폭 = 컨테이너 폭 */}
      <div className="px-7">
        <motion.div
          ref={scrollRef}
          onScroll={handleScroll}
          className="overflow-x-auto snap-x snap-mandatory scroll-smooth hide-scrollbar pt-3 pb-4 px-0"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.3 }}
        >
          <div className="flex w-full h-full">
            {petList.map((pet, index) => (
              <motion.div
                key={pet.id}
                className="w-full flex-shrink-0 snap-start"   // ← 내부 padding 제거
                onClick={() => handlePetClick(pet)}
                initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 + index * 0.05, duration: 0.25 }}
                whileTap={{ scale: 0.97 }}
              >
                {/* 카드 자체에 마진만 살짝 */}
                <div className="px-4">
                  <PetProfileCard
                    name={pet.name}
                    genderAge={pet.genderText}
                    breedAge={pet.breedAge}
                    weight={pet.weight ?? '-'}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 인디케이터: 슬라이드 개수와 정확히 동일 + 범위 클램프 */}
        <motion.div className="flex justify-center gap-4 mb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.2 }}>
          {Array.from({ length: totalSlides }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => scrollToIndex(idx)}
              aria-label={`slide ${idx + 1}`}
              className={`w-2 h-2 rounded-full cursor-pointer transition-all ${idx === currentIndex ? 'bg-green-300 scale-125' : 'bg-green-200'}`}
            />
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}
