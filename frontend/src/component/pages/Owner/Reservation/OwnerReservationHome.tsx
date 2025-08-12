import React, { useEffect, useRef } from 'react';
import '@/styles/main.css';
import SimpleHeader from '@/component/header/SimpleHeader';
import ImageInputBox from '@/component/input/ImageInputBox';
import { useState } from 'react';
import TabGroupWaiting from '@/component/navbar/TabGroupWaiting';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { getReservations } from '@/services/api/Owner/ownerreservation';
import { timeMapping } from '@/utils/timeMapping';
import { subjectmapping } from '@/utils/subjectMapping';

import type { ReservationsResponse, PetResponse, OwnerReservationList } from '@/types/Owner/ownerreservationType';
import { statusMapping } from '@/utils/statusMapping';

export default function OwnerReservationHome() {
  const VITE_PHOTO_URL = import.meta.env.VITE_PHOTO_URL;
  const navigate = useNavigate();

  const [currentTab, setCurrentTab] = useState<string>('대기');
  const [reservations, setReservations] = useState<ReservationsResponse[]>([]);
  const [petList, setPetList] = useState<PetResponse[]>([]);
  const data = useRef<OwnerReservationList[]>([]);
  const { selectedPetIndex } = useParams<{ selectedPetIndex: string }>();
  const [selectedPet, setSelectedPet] = useState<number>(selectedPetIndex ? Number(selectedPetIndex) : 0);
  const { isRejected } = useLocation().state || {};

  // 마운트 될 떄 반려동물 목록 조회
  useEffect(() => {
    const getReservationList = async () => {
      data.current = await getReservations();
      console.log('data:', data);
      const petList = data.current.map((reservation) => reservation.petResponse);
      setPetList(petList);
      const initialIndex = selectedPetIndex ? Number(selectedPetIndex) : 0;
      setSelectedPet(initialIndex);

      // 데이터 로딩 후 즉시 필터링
      if (data.current.length > 0) {
        const allReservation = data.current[initialIndex];
        if (allReservation?.reservations) {
          const filteredReservations = allReservation.reservations.filter(
            (res) => statusMapping[res.status] === currentTab,
          );
          setReservations(filteredReservations);
        }
      }
    };
    getReservationList();
  }, []);

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

  useEffect(() => {
    setCurrentTab('대기');
    if (data.current.length > 0 && selectedPet >= 0) {
      const allReservation = data.current[selectedPet];
      if (allReservation?.reservations) {
        const filteredReservations = allReservation.reservations.filter(
          (res) => statusMapping[res.status] === currentTab,
        );
        setReservations(filteredReservations);
      }
    }
  }, [selectedPet]);

  return (
    <div>
      <div className="sticky top-0 z-10 bg-gray-50">
        <SimpleHeader text="나의 예약" />
        {/* 반려동물 선택 */}
        <div className="flex justify-center gap-4 pt-6 px-7 overflow-x-auto hide-scrollbar">
          {petList.map((pet, idx) => (
            <div key={idx} className="flex flex-col items-center cursor-pointer" onClick={() => setSelectedPet(idx)}>
              <ImageInputBox
                src={`${VITE_PHOTO_URL}${pet.photo}`}
                stroke={
                  selectedPet === idx
                    ? 'border-5 border-green-300'
                    : pet.photo && pet.photo !== ''
                    ? 'border-1 border-gray-300'
                    : 'border-1 border-green-200'
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
              onClick={() => {
                if (res.status === 'REJECTED') {
                  // 반려 상태면 반려 사유와 함께 전달
                  navigate(`/owner/reservation/${res.reservationId}`, {
                    state: { isRejected: true },
                  });
                } else {
                  // 일반 상세 페이지로 이동
                  navigate(`/owner/reservation/${res.reservationId}`);
                }
              }}
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
