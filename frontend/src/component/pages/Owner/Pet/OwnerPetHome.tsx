import '@/styles/main.css';

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { petMockList } from './petMockList';

import SimpleHeader from '@/component/header/SimpleHeader';
import ImageInputBox from '@/component/input/ImageInputBox';
import TabGroupPet from '@/component/navbar/TabGroupPet';
import OwnerPetTabInfo from './OwnerPetTabInfo';
import OwnerPetTabRecord from './OwnerPetTabRecord';

import { motion, AnimatePresence } from 'framer-motion';
import PlusIcon from '@/component/icon/PlusIcon';

export default function OwnerPetHome() {
  const navigate = useNavigate();
  const [pets, setPets] = useState(petMockList);
  const [selectedPet, setSelectedPet] = useState(petMockList[0]);
  const [selectedTab, setSelectedTab] = useState('상세 정보');

  const handleRegister = () => {
    navigate('/owner/pet/register');
  };

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
              key={pet.id}
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

        {/* 2. 탭 메뉴 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.3 }}
        >
          <TabGroupPet selected={selectedTab} onSelect={setSelectedTab} />
        </motion.div>

        {/* 3. 탭 콘텐츠 (애니메이션 전환) */}
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
