import React from 'react';
import '@/styles/main.css';
import SimpleHeader from '@/component/header/SimpleHeader';
import ImageInputBox from '@/component/input/ImageInputBox';
import { useState } from 'react';
import TabGroupWaiting from '@/component/navbar/TabGroupWaiting';
import { useNavigate } from 'react-router-dom';
import SummaryContent from '@/component/text/SummaryContent';

// 더미데이터
interface Owner {
  name: string;
  phone: string;
  birth: string;
}

interface Pet {
  petId: number;
  name: string;
  species: string;
  photo: string;
  gender: string;
  age: number;
}

interface Reservation {
  reservationId: number;
  owner: Owner;
  pet: Pet;
  hospitalName: string;
  vetName: string;
  reservationDay: string;
  reservationTime: string;
  photo: string;
  description: string;
  subject: string;
  status: string;
}

const reservations: { [petName: string]: Reservation[] } = {
  미료: [
    {
      reservationId: 1,
      owner: {
        name: '홍길동',
        phone: '010-1234-5678',
        birth: '2020-01-01',
      },
      pet: {
        petId: 1,
        name: '미료',
        species: 'DOG',
        photo: '/images/미료_test.jpg',
        gender: 'FEMALE',
        age: 4,
      },
      hospitalName: '튼튼동물병원',
      vetName: '김수의',
      reservationDay: '2025-08-05',
      reservationTime: '10:00',
      photo: '/images/미료_test.jpg',
      description: '피부에 뭐가 나서 병원에 방문했습니다.',
      subject: '피부과',
      status: '대기',
    },
    {
      reservationId: 2,
      owner: {
        name: '홍길동',
        phone: '010-1234-5678',
        birth: '2020-01-01',
      },
      pet: {
        petId: 1,
        name: '미료',
        species: 'DOG',
        photo: '/images/미료_test.jpg',
        gender: 'FEMALE',
        age: 4,
      },
      hospitalName: '튼튼동물병원',
      vetName: '이수의',
      reservationDay: '2025-08-06',
      reservationTime: '11:30',
      photo: '/images/미료_test.jpg',
      description: '정기 건강검진',
      subject: '내과',
      status: '승인',
    },
    {
      reservationId: 3,
      owner: {
        name: '홍길동',
        phone: '010-1234-5678',
        birth: '2020-01-01',
      },
      pet: {
        petId: 1,
        name: '미료',
        species: 'DOG',
        photo: '/images/미료_test.jpg',
        gender: 'FEMALE',
        age: 4,
      },
      hospitalName: '튼튼동물병원',
      vetName: '이수의',
      reservationDay: '2025-08-07',
      reservationTime: '11:30',
      photo: '/images/미료_test.jpg',
      description: '내과 문제',
      subject: '내과',
      status: '반려',
    },
    {
      reservationId: 4,
      owner: {
        name: '홍길동',
        phone: '010-1234-5678',
        birth: '2020-01-01',
      },
      pet: {
        petId: 1,
        name: '미료',
        species: 'DOG',
        photo: '/images/미료_test.jpg',
        gender: 'FEMALE',
        age: 4,
      },
      hospitalName: '튼튼동물병원',
      vetName: '이수의',
      reservationDay: '2025-08-07',
      reservationTime: '11:30',
      photo: '/images/미료_test.jpg',
      description: '내과 문제',
      subject: '내과',
      status: '반려',
    },
    {
      reservationId: 5,
      owner: {
        name: '홍길동',
        phone: '010-1234-5678',
        birth: '2020-01-01',
      },
      pet: {
        petId: 1,
        name: '미료',
        species: 'DOG',
        photo: '/images/미료_test.jpg',
        gender: 'FEMALE',
        age: 4,
      },
      hospitalName: '튼튼동물병원',
      vetName: '이수의',
      reservationDay: '2025-08-07',
      reservationTime: '11:30',
      photo: '/images/미료_test.jpg',
      description: '내과 문제',
      subject: '내과',
      status: '반려',
    },
    {
      reservationId: 6,
      owner: {
        name: '홍길동',
        phone: '010-1234-5678',
        birth: '2020-01-01',
      },
      pet: {
        petId: 1,
        name: '미료',
        species: 'DOG',
        photo: '/images/미료_test.jpg',
        gender: 'FEMALE',
        age: 4,
      },
      hospitalName: '튼튼동물병원',
      vetName: '이수의',
      reservationDay: '2025-08-07',
      reservationTime: '11:30',
      photo: '/images/미료_test.jpg',
      description: '내과 문제',
      subject: '내과',
      status: '반려',
    },
    {
      reservationId: 7,
      owner: {
        name: '홍길동',
        phone: '010-1234-5678',
        birth: '2020-01-01',
      },
      pet: {
        petId: 1,
        name: '미료',
        species: 'DOG',
        photo: '/images/미료_test.jpg',
        gender: 'FEMALE',
        age: 4,
      },
      hospitalName: '튼튼동물병원',
      vetName: '이수의',
      reservationDay: '2025-08-07',
      reservationTime: '11:30',
      photo: '/images/미료_test.jpg',
      description: '내과 문제',
      subject: '내과',
      status: '반려',
    },
    {
      reservationId: 8,
      owner: {
        name: '홍길동',
        phone: '010-1234-5678',
        birth: '2020-01-01',
      },
      pet: {
        petId: 1,
        name: '미료',
        species: 'DOG',
        photo: '/images/미료_test.jpg',
        gender: 'FEMALE',
        age: 4,
      },
      hospitalName: '튼튼동물병원',
      vetName: '이수의',
      reservationDay: '2025-08-07',
      reservationTime: '11:30',
      photo: '/images/미료_test.jpg',
      description: '내과 문제',
      subject: '내과',
      status: '반려',
    },
    {
      reservationId: 9,
      owner: {
        name: '홍길동',
        phone: '010-1234-5678',
        birth: '2020-01-01',
      },
      pet: {
        petId: 1,
        name: '미료',
        species: 'DOG',
        photo: '/images/미료_test.jpg',
        gender: 'FEMALE',
        age: 4,
      },
      hospitalName: '튼튼동물병원',
      vetName: '이수의',
      reservationDay: '2025-08-07',
      reservationTime: '11:30',
      photo: '/images/미료_test.jpg',
      description: '내과 문제',
      subject: '내과',
      status: '반려',
    },
    {
      reservationId: 9,
      owner: {
        name: '홍길동',
        phone: '010-1234-5678',
        birth: '2020-01-01',
      },
      pet: {
        petId: 1,
        name: '미료',
        species: 'DOG',
        photo: '/images/미료_test.jpg',
        gender: 'FEMALE',
        age: 4,
      },
      hospitalName: '튼튼동물병원',
      vetName: '이수의',
      reservationDay: '2025-08-07',
      reservationTime: '11:30',
      photo: '/images/미료_test.jpg',
      description: '내과 문제',
      subject: '내과',
      status: '반려',
    },
    {
      reservationId: 10,
      owner: {
        name: '홍길동',
        phone: '010-1234-5678',
        birth: '2020-01-01',
      },
      pet: {
        petId: 1,
        name: '미료',
        species: 'DOG',
        photo: '/images/미료_test.jpg',
        gender: 'FEMALE',
        age: 4,
      },
      hospitalName: '튼튼동물병원',
      vetName: '이수의',
      reservationDay: '2025-08-07',
      reservationTime: '11:30',
      photo: '/images/미료_test.jpg',
      description: '내과 문제',
      subject: '내과',
      status: '반려',
    },
  ],
  초코: [
    {
      reservationId: 11,
      owner: {
        name: '이몽룡',
        phone: '010-5678-1234',
        birth: '2019-05-10',
      },
      pet: {
        petId: 2,
        name: '초코',
        species: 'DOG',
        photo: '/images/미료_test.jpg',
        gender: 'MALE',
        age: 5,
      },
      hospitalName: '희망동물병원',
      vetName: '최수의',
      reservationDay: '2025-08-07',
      reservationTime: '14:00',
      photo: '/images/미료_test.jpg',
      description: '다리 통증으로 내원',
      subject: '정형외과',
      status: '대기',
    },
    {
      reservationId: 12,
      owner: {
        name: '이몽룡',
        phone: '010-5678-1234',
        birth: '2019-05-10',
      },
      pet: {
        petId: 2,
        name: '초코',
        species: 'DOG',
        photo: '/images/미료_test.jpg',
        gender: 'MALE',
        age: 5,
      },
      hospitalName: '튼튼동물병원',
      vetName: '김수의',
      reservationDay: '2025-08-08',
      reservationTime: '16:30',
      photo: '/images/미료_test.jpg',
      description: '피부 알러지 진료',
      subject: '피부과',
      status: '반려',
    },
  ],
};

export default function OwnerReservation() {
  const navigate = useNavigate();
  const [selectedIdx, setSelectedIdx] = useState(0); // 기본값 : 첫번째 항목
  const [currentTab, setCurrentTab] = useState<string>('대기'); // 기본값 : '대기'

  const selectedPetName = Object.keys(reservations)[selectedIdx];
  const currentPetReservations = reservations[selectedPetName] || [];
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
      <div className="sticky top-0 z-10 bg-green-100">
        <SimpleHeader text="나의 예약" />
        {/* 반려동물 선택 */}
        <div className="flex gap-4 justify-center mt-3">
          {Object.keys(reservations).map((pet, idx) => (
            <div key={idx} className="flex flex-col items-center cursor-pointer" onClick={() => setSelectedIdx(idx)}>
              <ImageInputBox
                src={reservations[pet][0].photo}
                stroke={selectedIdx === idx ? 'border-5 border-pink-200' : 'border border-gray-300'}
              />
              {selectedIdx === idx ? <div className="h4 mt-1">{pet}</div> : <div className="p mt-1">{pet}</div>}
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
        {filteredReservations.length > 0 ? (
          filteredReservations.map((res) => (
            <div
              key={res.reservationId}
              className="mb-5 cursor-pointer"
              onClick={() => navigate(`/owner/reservation/${res.reservationId}`)}
            >
              <div className="flex justify-between">
                <div className="flex flex-col">
                  <div className="h4 text-black">{res.subject}</div>
                  <div className="p text-black"> {res.vetName} 수의사</div>
                  <div className="caption text-black">{res.hospitalName}</div>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="h4 text-black">{res.reservationTime}</div>
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
