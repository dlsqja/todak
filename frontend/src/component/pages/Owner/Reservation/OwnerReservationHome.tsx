import React, { useEffect, useRef } from 'react';
import '@/styles/main.css';
import SimpleHeader from '@/component/header/SimpleHeader';
import ImageInputBox from '@/component/input/ImageInputBox';
import { useState } from 'react';
import TabGroupWaiting from '@/component/navbar/TabGroupWaiting';
import { useNavigate } from 'react-router-dom';
import { getReservations } from '@/services/api/Owner/ownerreservation';
import { timeMapping } from '@/utils/timeMapping';
import { subjectmapping } from '@/utils/subjectMapping';

import type { ReservationsResponse, PetResponse, OwnerReservationList } from '@/types/Owner/ownerreservationType';

export default function OwnerReservationHome() {
  const VITE_PHOTO_URL = import.meta.env.VITE_PHOTO_URL;
  const navigate = useNavigate();
  const [selectedPet, setSelectedPet] = useState<number>(-1);
  const [currentTab, setCurrentTab] = useState<string>('대기');
  const [reservations, setReservations] = useState<ReservationsResponse[]>([]);
  const [petList, setPetList] = useState<PetResponse[]>([]);
  const data = useRef<OwnerReservationList[]>([]);

  useEffect(() => {
    const getReservationList = async () => {
      data.current = await getReservations();
      const petList = data.current.map((reservation) => reservation.petResponse);
      setPetList(petList);
      setSelectedPet(0);
    };
    getReservationList();
  }, []);

  useEffect(() => {
    if (data.current != undefined) {
      console.log('data:', data);
      const allReservation = data.current[selectedPet];
      if (allReservation != undefined) {
        setReservations(allReservation.reservations);
      }
    }
  }, [selectedPet]);

  return (
    <div>
      <div className="sticky top-0 z-10 bg-green-100">
        <SimpleHeader text="나의 예약" />
        {/* 반려동물 선택 */}
        <div className="flex gap-4 pt-6 overflow-x-auto hide-scrollbar">
          {Object.keys(petList).map((pet, idx) => (
            <div key={idx} className="flex flex-col items-center cursor-pointer" onClick={() => setSelectedPet(idx)}>
              <ImageInputBox
                src={`${VITE_PHOTO_URL}${petList[pet].photo}`}
                stroke={selectedPet === idx ? 'border-5 border-pink-200' : 'border border-gray-300'}
              />
              {selectedPet === idx ? (
                <div className="h4 mt-1">{petList[pet].name}</div>
              ) : (
                <div className="p mt-1">{petList[pet].name}</div>
              )}
            </div>
          ))}
        </div>

        {/* 대기 승인 반려 탭 */}
        <div className="mt-5 border-b-1 border-gray-100">
          <TabGroupWaiting
            selected={currentTab}
            onSelect={(tabLabel) => {
              setCurrentTab(tabLabel);
            }}
          />
        </div>
      </div>

      {/* 필터링 결과 조회 */}
      <div className="w-full px-7 mt-5 overflow-y-auto h-full hide-scrollbar">
        {reservations.length > 0 ? (
          reservations.map((res) => (
            <div
              key={res.reservationId}
              className="mb-5 cursor-pointer"
              onClick={() => navigate(`/owner/reservation/${res.reservationId}`)}
            >
              <div className="flex justify-between">
                <div className="flex flex-col">
                  <div className="h4 text-black">{subjectmapping[res.subject]}</div>
                  <div className="p text-black"> {res.vetName} 수의사</div>
                  <div className="caption text-black">{res.hospitalName}</div>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="h4 text-black">{timeMapping[res.reservationTime]}</div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="mt-8 h4 text-center text-gray-500"> {currentTab} 내역이 없습니다.</div>
        )}
      </div>
    </div>
  );
}
