import React, { useEffect, useState, useRef } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import '@/styles/main.css';
import PetProfileCard from '@/component/card/PetProfileCard';
import SearchInput from '@/component/input/SearchInput';
import { motion } from 'framer-motion';

interface Pet {
  id: number;
  name: string;
  genderAge: string;
  breedAge: string;
  weight: string;
}

export default function OwnerHome() {
  const navigate = useNavigate();
  const [petList, setPetList] = useState<Pet[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // TODO: 실제 API 연결해야 함!! 여기선 mock 데이터 사용!!
    setPetList([
      { id: 1, name: '미료', genderAge: '여 (중성)', breedAge: '비숑 9세', weight: '4.1kg' },
      { id: 2, name: '콩이', genderAge: '남 (중성)', breedAge: '푸들 4세', weight: '3.5kg' },
      { id: 3, name: '망고', genderAge: '여 (중성)', breedAge: '말티즈 6세', weight: '2.8kg' },
    ]);
  }, []);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const scrollX = scrollRef.current.scrollLeft;
    const itemWidth = scrollRef.current.clientWidth;
    const newIndex = Math.round(scrollX / itemWidth);
    setCurrentIndex(newIndex);
  };

  const scrollToIndex = (index: number) => {
    if (!scrollRef.current) return;
    const itemWidth = scrollRef.current.clientWidth;
    scrollRef.current.scrollTo({
      left: itemWidth * index,
      behavior: 'smooth',
    });
    setCurrentIndex(index);
  };

  const handlePetClick = (pet: Pet) => {
    navigate('/owner/home/hospital', {
      state: { pet },
    });
  };

  return (
    <motion.div
      className="pb-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* 상단 텍스트 */}
      <motion.h3
        className="h3 mx-7 pt-13"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        ㅇㅇㅇ님 반가워요!
      </motion.h3>

      <motion.h3
        className="h3 mx-7 mb-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        비대면 진료가 처음이신가요?
      </motion.h3>

      <motion.button
        onClick={() => navigate('/owner/home/guide')}
        className="h5 mx-7 px-5 py-1 rounded-full inline-block bg-green-300 text-green-100 hover:bg-green-200 transition"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.3 }}
      >
        비대면 진료 가이드
      </motion.button>

      <motion.h3
        className="mx-7 h3 mt-11"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.3 }}
      >
        비대면 진료 시작하기
      </motion.h3>

      {/* 🐶 펫 리스트 슬라이드 */}
      <motion.div
        ref={scrollRef}
        onScroll={handleScroll}
        className="overflow-x-auto snap-x snap-mandatory scroll-smooth hide-scrollbar pt-3 pb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.3 }}
      >
        <div className="flex w-full h-full">
          {petList.map((pet, index) => (
            <motion.div
              key={pet.id}
              className="w-full flex-shrink-0 snap-start px-7"
              onClick={() => handlePetClick(pet)}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + index * 0.1, duration: 0.3 }}
              whileTap={{ scale: 0.95 }}
            >
              <PetProfileCard
                name={pet.name}
                genderAge={pet.genderAge}
                breedAge={pet.breedAge}
                weight={pet.weight}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* 🔘 인디케이터 */}
      <motion.div
        className="flex justify-center gap-2 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.3 }}
      >
        {petList.map((_, idx) => (
          <button
            key={idx}
            onClick={() => scrollToIndex(idx)}
            className={`w-2 h-2 rounded-full transition-all ${
              idx === currentIndex ? 'bg-green-300 scale-125' : 'bg-green-200'
            }`}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}
