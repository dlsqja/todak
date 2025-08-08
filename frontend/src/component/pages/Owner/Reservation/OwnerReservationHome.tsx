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
import { statusMapping } from '@/utils/statusMapping';

export default function OwnerReservationHome() {
  const VITE_PHOTO_URL = import.meta.env.VITE_PHOTO_URL;
  const navigate = useNavigate();
  const [selectedPet, setSelectedPet] = useState<number>(-1);
  const [currentTab, setCurrentTab] = useState<string>('대기');
  const [reservations, setReservations] = useState<ReservationsResponse[]>([]);
  const [petList, setPetList] = useState<PetResponse[]>([]);
  const data = useRef<OwnerReservationList[]>([]);

  // 마운트 될 떄 반려동물 목록 조회
  useEffect(() => {
    const getReservationList = async () => {
      data.current = await getReservations();
      const petList = data.current.map((reservation) => reservation.petResponse);
      setPetList(petList);
      setSelectedPet(0);
    };
    getReservationList();
  }, []);

  // 반려동물 선택할 때마다 그 동물의 전체 예약 내역 조회
  useEffect(() => {
    if (data.current != undefined) {
      console.log('data:', data);
      const allReservation = data.current[selectedPet];
      if (allReservation != undefined) {
        setReservations(allReservation.reservations);
        console.log('reservations:', reservations);
      }
    }
  }, [selectedPet]);

  // 대기, 승인, 반려 탭 누를때마다 필터링한 데이터 저장
  useEffect(() => {
    if (data.current.length > 0 && selectedPet >= 0) {
      const allReservation = data.current[selectedPet];
      if (allReservation?.reservations) {
        const filteredReservations = allReservation.reservations.filter(
          (res) => statusMapping[res.status] === currentTab,
        );
        setReservations(filteredReservations);
      }
    }
  }, [currentTab]);

  return (
    <div>
      <div className="sticky top-0 z-10 bg-green-100">
        <SimpleHeader text="나의 예약" />
        {/* 반려동물 선택 */}
        <div className="flex gap-4 pt-6 px-7 overflow-x-auto hide-scrollbar">
          {petList.map((pet, idx) => (
            <div key={idx} className="flex flex-col items-center cursor-pointer" onClick={() => setSelectedPet(idx)}>
              <ImageInputBox
                src={`${VITE_PHOTO_URL}${pet.photo}`}
                stroke={
                  selectedPet === idx
                    ? 'border-5 border-pink-200'
                    : pet.photo && pet.photo !== ''
                    ? 'border border-gray-300'
                    : 'border border-pink-100'
                }
              />
              {selectedPet === idx ? (
                <div className="h4 mt-1">{pet.name}</div>
              ) : (
                <div className="p mt-1">{pet.name}</div>
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
