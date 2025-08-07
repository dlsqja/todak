import '@/styles/main.css';

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import SimpleHeader from '@/component/header/SimpleHeader';
import ImageInputBox from '@/component/input/ImageInputBox';
import TabGroupPet from '@/component/navbar/TabGroupPet';
import OwnerPetTabInfo from './OwnerPetTabInfo';
import OwnerPetTabRecord from './OwnerPetTabRecord';

import { motion, AnimatePresence } from 'framer-motion';
import PlusIcon from '@/component/icon/PlusIcon';

import { getMyPets } from '@/services/api/Owner/ownerpet' // ✅ API 함수 import

export default function OwnerPetHome() {
  const navigate = useNavigate();
  const [pets, setPets] = useState([]);              // 실제 API로 바뀐 데이터
  const [selectedPet, setSelectedPet] = useState(null);
  const [selectedTab, setSelectedTab] = useState('상세 정보');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleRegister = () => {
    navigate('/owner/pet/register');
  };

  // ✅ API 호출 로직
  // useEffect(() => {
  //   const fetchPets = async () => {
  //     try {
  //       const data = await getMyPets();
  //       setPets(data);
  //       setSelectedPet(data[0]); // 첫 번째 pet 선택
  //     } catch (err) {
  //       setError(err);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };
  useEffect(() => {
  const fetchPets = async () => {
    try {
      const data = await getMyPets();
      if (Array.isArray(data)) {
        setPets(data);
        setSelectedPet(data[0]);
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
  }, []);

  if (isLoading) return <div className="p">불러오는 중...</div>;
  if (error) return <div className="p">에러 발생: {error.message}</div>;
  if (pets.length === 0) return (
    <div className="p flex flex-col items-center justify-center h-[60vh] gap-6 text-center">
      <p className="p">등록된 반려동물이 없습니다.</p>
      <button
        className="text-white bg-green-400 px-6 py-2 rounded-xl h5"
        onClick={handleRegister}
      >
        반려동물 등록하기
      </button>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <SimpleHeader text="반려동물 관리" />

      <div className="px-7 space-y-6 pt-6">
        {/* 1. 반려동물 이미지 리스트 */}
        <motion.div
          className="flex justify-center gap-4 overflow-x-auto"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          {pets.map((pet) => (
            <motion.div
              key={pet.petId}
              className="flex flex-col items-center cursor-pointer"
              onClick={() => setSelectedPet(pet)}
              whileTap={{ scale: 0.95 }}
            >
              <ImageInputBox
                src={pet.image}
                stroke={
                  pet.id === selectedPet?.id
                    ? 'border-4 border-pink-200'
                    : !pet.image || pet.image === '/images/pet_default.png'
                    ? 'border-1 border-pink-100'
                    : 'border-1 border-green-100'
                }
              />
              <p className="p mt-2 text-black">{pet.name}</p>
            </motion.div>
          ))}

          {/* 등록 버튼 */}
          <motion.div
            className="flex flex-col items-center mt-5 cursor-pointer"
            onClick={handleRegister}
            whileTap={{ scale: 0.95 }}
          >
            <PlusIcon fill="#afcf7e" stroke="#fdfcfb" />
          </motion.div>
        </motion.div>

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
              <OwnerPetTabInfo selectedPet={selectedPet} setPets={setPets} setSelectedPet={setSelectedPet} />
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
  );
}
