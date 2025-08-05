import React from 'react';
import '@/styles/main.css';
import SimpleHeader from '@/component/header/SimpleHeader';
import ImageInputBox from '@/component/input/ImageInputBox';
import { useState } from 'react';
import TabGroupWaiting from '@/component/navbar/TabGroupWaiting';

// DB의 enum과과 상태 매핑
const status = {
  0: '대기',
  1: '승인',
  2: '반려',
} as const;

type StatusNumber = keyof typeof status;

// 타입 설정
interface Reservation {
  id: number;
  subject: string;
  doctor: string;
  hospital: string;
  reservation_time: string;
  status: StatusNumber;
}

interface Pet {
  name: string;
  photo: string;
}

// 테스트용 더미데이터
const reservations: { [petName: string]: Reservation[] } = {
  미료: [
    { id: 1, subject: '피부과', doctor: '김수의', hospital: '튼튼동물병원', reservation_time: '10:00', status: 0 },
    { id: 2, subject: '내과', doctor: '이수의', hospital: '건강동물병원', reservation_time: '11:30', status: 1 },
    { id: 3, subject: '내과', doctor: '이수의', hospital: '건강동물병원', reservation_time: '11:30', status: 1 },
    { id: 4, subject: '내과', doctor: '이수의', hospital: '건강동물병원', reservation_time: '11:30', status: 2 },
  ],
  초코: [
    { id: 5, subject: '정형외과', doctor: '박수의', hospital: '튼튼동물병원', reservation_time: '14:00', status: 0 },
    { id: 6, subject: '안과', doctor: '최수의', hospital: '희망동물병원', reservation_time: '15:00', status: 1 },
    { id: 7, subject: '피부과', doctor: '김수의', hospital: '튼튼동물병원', reservation_time: '16:30', status: 0 },
    { id: 8, subject: '피부과', doctor: '김수의', hospital: '튼튼동물병원', reservation_time: '16:30', status: 0 },
  ],
};

const pets: Pet[] = [
  { name: '미료', photo: '/images/미료_test.jpg' },
  { name: '초코', photo: '/images/미료_test.jpg' },
];

export default function OwnerReservation() {
  const [selectedIdx, setSelectedIdx] = useState(0); // 기본값 : 첫번째 항목
  const [currentTab, setCurrentTab] = useState<StatusNumber>(0); // 기본값 : '대기'

  const selectedPet = pets[selectedIdx].name;
  const currentPetReservations = reservations[selectedPet] || [];
  const filteredReservations = currentPetReservations.filter((reservation) => reservation.status === currentTab);

  // 백엔드 API에 요청을 보내는 함수
  // const [reservations, setReservations] = useState<Reservation[]>([]);
  // useEffect(() => {
  //   // 백엔드 API에 요청을 보내는 함수 (axios나 fetch 사용)
  //   const fetchReservations = async () => {
  //     try {
  //       const response = await fetch('/api/my-reservations'); // API 엔드포인트
  //       const data = await response.json();

  //       // API로부터 받은 실제 데이터를 reservations 상태에 저장
  //       setReservations(data);
  //     } catch (error) {
  //       console.error("예약 목록을 불러오는 데 실패했습니다:", error);
  //     }
  //   };

  //   fetchReservations(); // 함수 호출
  // }, []);

  // 선택된 반려동물 이름

  return (
    <div>
      <SimpleHeader text="나의 예약" />

      {/* 반려동물 선택택 */}
      <div className="flex gap-4 justify-center mt-3">
        {pets.map((pet, idx) => (
          <div key={idx} className="flex flex-col items-center cursor-pointer" onClick={() => setSelectedIdx(idx)}>
            <ImageInputBox
              src={pet.photo}
              stroke={selectedIdx === idx ? 'border-5 border-pink-200' : 'border border-gray-300'}
            />
            {selectedIdx === idx ? <div className="h4 mt-1">{pet.name}</div> : <div className="mt-1">{pet.name}</div>}
          </div>
        ))}
      </div>

      {/* 대기 승인 반려 탭 */}
      <div className="mt-5 border-b-1 border-gray-100">
        <TabGroupWaiting
          selected={status[currentTab]}
          onSelect={(tabLabel) => {
            const statusKey = Object.keys(status).find((key) => status[Number(key) as StatusNumber] === tabLabel);
            if (statusKey) {
              setCurrentTab(Number(statusKey) as StatusNumber);
            }
          }}
        />
      </div>

      {/* 필터링 */}
      <div className="w-full px-7 mt-5">
        {filteredReservations.length > 0 ? (
          filteredReservations.map((res) => (
            <div key={res.id} className="mb-5">
              <div className="flex justify-between">
                <div className="flex flex-col">
                  <div className="h4 text-black">{res.subject}</div>
                  <div className="p text-black"> {res.doctor} 수의사</div>
                  <div className="caption text-black">{res.hospital}</div>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="h4 text-black">{res.reservation_time}</div>
                  <button className="w-17 h-6 h5 rounded-[12px] bg-gray-300 text-black">상세</button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="mt-8 h4 text-center text-gray-500"> {status[currentTab]} 내역이 없습니다.</div>
        )}
      </div>
    </div>
  );
}
