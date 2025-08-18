import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import SimpleHeader from '@/component/header/SimpleHeader';
import ImageInputBox from '@/component/input/ImageInputBox';
import TabGroupPet from '@/component/navbar/TabGroupPet';
import OwnerPetTabInfo from './OwnerPetTabInfo';
import OwnerPetTabRecord from './OwnerPetTabRecord';

import { motion, AnimatePresence, useReducedMotion, type Variants } from 'framer-motion';
import PlusIcon from '@/component/icon/PlusIcon';

import { getMyPets } from '@/services/api/Owner/ownerpet'; // ✅ API 함수 import
import usePetStore from '@/store/petStore';

// 🔹 리스트 좌→우 등장 variants
const stripVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      delayChildren: 0.05,
      staggerChildren: 0.17,
    },
  },
};
const itemVariants: Variants = {
  hidden: { opacity: 0, x: -24 },
  show: { opacity: 1, x: 0, transition: { duration: 0.26, ease: [0.22, 1, 0.36, 1] } },
};

export default function OwnerPetHome() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { state } = useLocation();
  const shouldReduce = useReducedMotion();

  // URL 파라미터나 state에서 탭 정보 확인
  const initialTab = searchParams.get('tab') === 'record' ? '진료 내역' : state?.selectedTab || '상세 정보';

  const [pets, setPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const [selectedTab, setSelectedTab] = useState(initialTab);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { deletePet } = usePetStore(); // Zustand store 사용

  const handleRegister = () => {
    navigate('/owner/pet/register');
  };

  // ✅ API 호출 로직
  useEffect(() => {
    const fetchPets = async () => {
      try {
        const data = await getMyPets();
        if (Array.isArray(data)) {
          setPets(data);

          // state로 전달받은 petId가 있으면 해당 펫을 선택, 없으면 첫 번째 펫
          const targetPetId = state?.selectedPetId;
          const targetPet = targetPetId ? data.find((pet) => pet.petId === targetPetId) : null;
          setSelectedPet(targetPet || data[0]);
        } else {
          console.error('❌ 응답이 배열이 아님:', data);
          setPets([]); // fallback
        }
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPets();
  }, [setPets, setSelectedPet]);

  return (
    <>
      <SimpleHeader text="반려동물 관리" />
      {isLoading && <div className="h4 text-center mt-76 text-gray-400">불러오는 중...</div>}
      {error && <div className="h4 text-center mt-76 text-gray-400">데이터를 불러올 수 없습니다</div>}
      {pets.length === 0 && !isLoading && !error && (
        <div className="flex-1 flex items-center justify-center px-7 mt-60">
          <div className="flex flex-col items-center gap-2">
            <img src="/images/sad_dog.png" alt="nodata" className="w-20 h-20" />
            <p className="h4 text-gray-500">등록된 반려동물이 없습니다.</p>
            <button
              className="text-white bg-green-300/60 hover:bg-green-400 px-6 py-2 rounded-xl p cursor-pointer"
              onClick={() => navigate('/owner/pet/register')}
            >
              반려동물 등록하러 가기
            </button>
          </div>
        </div>
      )}

      {/* 펫이 있을 때만 나머지 UI 표시 */}
      {pets.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="px-7 space-y-6 pt-6">
            {/* 1. 반려동물 이미지 리스트 (좌→우 순차 등장으로 수정) */}
            <motion.ul
              className="flex px-7 gap-4 overflow-x-auto hide-scrollbar"
              variants={stripVariants}
              initial="hidden"
              animate="show"
              transition={shouldReduce ? { duration: 0 } : undefined}
              // 뷰포트 들어올 때 한 번만 재생하고 싶으면 아래 주석 해제:
              // viewport={{ once: true, amount: 0.2 }}
            >
              {pets.map((pet) => (
                <motion.li
                  key={pet.petId}
                  variants={itemVariants}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={shouldReduce ? { duration: 0 } : { duration: 0.08 }}
                  className="flex flex-col items-center cursor-pointer"
                  onClick={() => setSelectedPet(pet)}
                  role="button"
                  aria-pressed={selectedPet?.petId === pet.petId}
                >
                  <ImageInputBox
                    src={`${import.meta.env.VITE_PHOTO_URL}${pet.photo}`} // .env에 설정된 이미지 URL 사용
                    stroke={
                      selectedPet?.petId === pet.petId
                        ? 'border-5 border-green-300' // 선택된 반려동물만 green 표시 (원래 코드 유지)
                        : pet.photo && pet.photo !== '/images/pet_default.png'
                        ? 'border-1 border-gray-300'
                        : 'border-1 border-green-200'
                    }
                  />
                  <h4 className={selectedPet?.petId === pet.petId ? 'h4 mt-2 text-black' : 'p mt-2 text-black'}>
                    {pet.name}
                  </h4>
                </motion.li>
              ))}

              {/* 등록 버튼도 동일한 타이밍으로 합류 */}
              <motion.li
                key="register"
                variants={itemVariants}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="flex flex-col items-center mt-5 cursor-pointer"
                onClick={handleRegister}
                aria-label="반려동물 등록하기"
              >
                <PlusIcon fill="#afcf7e" stroke="#fdfcfb" />
              </motion.li>
            </motion.ul>

            {/* 탭 메뉴 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.3 }}
            >
              <TabGroupPet selected={selectedTab} onSelect={setSelectedTab} />
            </motion.div>

            {/* 탭 콘텐츠 */}
            <AnimatePresence mode="wait">
              {selectedTab === '상세 정보' && selectedPet && (
                <motion.div
                  key="info"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <OwnerPetTabInfo
                    selectedPet={selectedPet}
                    setSelectedPet={setSelectedPet}
                    pets={pets}
                    setPets={setPets}
                    onDelete={deletePet}
                  />
                </motion.div>
              )}
              {selectedTab === '진료 내역' && (
                <motion.div
                  key="record"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <OwnerPetTabRecord selectedPet={selectedPet} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </>
  );
}
