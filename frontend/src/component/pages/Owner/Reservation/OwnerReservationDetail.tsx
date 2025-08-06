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

// 더미데이터터
const reservations: { [petName: string]: Reservation[] } = {
  미료: [
    {
      reservationId: 1,
      owner: {
        name: '홍길동',
        phone: '010-1234-5678',
        birth: '2020.01.01',
      },
      pet: {
        petId: 1,
        name: '미료',
        species: '강아지',
        photo: '/images/미료_test.jpg',
        gender: 'FEMALE',
        age: 4,
      },
      hospitalName: '튼튼동물병원',
      vetName: '김수의',
      reservationDay: '2025.08.05',
      reservationTime: '10:00',
      photo: '/images/미료_test.jpg',
      description:
        '피부에 뭐가 나서 병원에 방문했습니다.피부에 뭐가 나서 병원에 방문했습니다피부에 뭐가 나서 병원에 방문했습니다피부에 뭐가 나서 병원에 방문했습니다피부에 뭐가 나서 병원에 방문했습니다피부에 뭐가 나서 병원에 방문했습니다피부에 뭐가 나서 병원에 방문했습니다피부에 뭐가 나서 병원에 방문했습니다피부에 뭐가 나서 병원에 방문했습니다피부에 뭐가 나서 병원에 방문했습니다피부에 뭐가 나서 병원에 방문했습니다피부에 뭐가 나서 병원에 방문했습니다피부에 뭐가 나서 병원에 방문했습니다피부에 뭐가 나서 병원에 방문했습니다피부에 뭐가 나서 병원에 방문했습니다피부에 뭐가 나서 병원에 방문했습니다피부에 뭐가 나서 병원에 방문했습니다피부에 뭐가 나서 병원에 방문했습니다피부에 뭐가 나서 병원에 방문했습니다피부에 뭐가 나서 병원에 방문했습니다',
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
        species: '강아지',
        photo: '/images/미료_test.jpg',
        gender: 'FEMALE',
        age: 4,
      },
      hospitalName: '튼튼동물병원',
      vetName: '이수의',
      reservationDay: '2025.08.06',
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
        species: '고양이',
        photo: '/images/미료_test.jpg',
        gender: 'FEMALE',
        age: 4,
      },
      hospitalName: '튼튼동물병원',
      vetName: '이수의',
      reservationDay: '2025.08.07',
      reservationTime: '11:30',
      photo: '/images/미료_test.jpg',
      description: '내과 문제',
      subject: '내과',
      status: '반려',
    },
  ],
  초코: [
    {
      reservationId: 4,
      owner: {
        name: '이몽룡',
        phone: '010-5678-1234',
        birth: '2019-05-10',
      },
      pet: {
        petId: 2,
        name: '초코',
        species: '강아지',
        photo: '/images/미료_test.jpg',
        gender: 'MALE',
        age: 5,
      },
      hospitalName: '희망동물병원',
      vetName: '최수의',
      reservationDay: '2025.08.07',
      reservationTime: '14:00',
      photo: '/images/미료_test.jpg',
      description: '다리 통증으로 내원',
      subject: '정형외과',
      status: '대기',
    },
    {
      reservationId: 5,
      owner: {
        name: '이몽룡',
        phone: '010-5678-1234',
        birth: '2019-05-10',
      },
      pet: {
        petId: 2,
        name: '초코',
        species: '강아지',
        photo: '/images/미료_test.jpg',
        gender: 'MALE',
        age: 5,
      },
      hospitalName: '튼튼동물병원',
      vetName: '김수의',
      reservationDay: '2025.08.08',
      reservationTime: '16:30',
      photo: '/images/미료_test.jpg',
      description: '피부 알러지 진료',
      subject: '피부과',
      status: '반려',
    },
  ],
};

import React, { useEffect, useState } from 'react';
import Button from '@/component/button/Button';
import { useParams } from 'react-router-dom';
import BackHeader from '@/component/header/BackHeader';
import ImageInputBox from '@/component/input/ImageInputBox';

export default function OwnerReservationDetail() {
  const { id } = useParams<{ id: string }>();
  const petName = '미료';

  const reservation = reservations[petName].find((item) => item.reservationId === Number(id));
  const getStatusColor = (status: string) => {
    if (status === '대기') return 'bg-gray-300 text-black';
    if (status === '승인') return 'bg-green-300 text-white';
    if (status === '반려') return 'bg-red-400 text-white';
    return 'bg-gray-300 text-black';
  };

  if (!reservation) {
    return (
      <>
        <BackHeader text="예약 정보" />
        <div className="pt-8 h4 text-center text-gray-500">예약 정보를 불러올 수 없습니다.</div>
      </>
    );
  }

  // 백엔드 API 연동
  // const { id } = useParams<{ id: string }>();
  // const [detail, setDetail] = useState<ReservationDetail | null>(null);
  // const [loading, setLoading] = useState(true);
  //   useEffect(() => {
  //     if (!id) return;
  //     setLoading(true);
  //     fetch(`/api/v1/reservations/owner/${id}`)
  //       .then((res) => res.json())
  //       .then((data) => {
  //         setDetail(data);
  //         setLoading(false);
  //       })
  //       .catch(() => setLoading(false));
  //   }, [id]);

  //   if (loading) return <div>로딩 중...</div>;
  //   if (!detail) return <div>예약 정보를 불러올 수 없습니다.</div>;

  return (
    <div>
      <BackHeader text="상세 정보" />
      <section className="flex flex-col gap-6 mt-4 px-7">
        <h4 className="h4">예약 상세 정보</h4>
        <div className="flex justify-between border-b-1 border-gray-100 pb-4 ">
          <div className="flex flex-col gap-2">
            <div className="h4">{reservation.pet.name}</div>
            <div className="flex gap-1">
              <div className="p text-center">{reservation.pet.species}</div> /
              <div className="p">{reservation.pet.age}세</div> /<div className="p">{reservation.subject}</div>
            </div>
          </div>
          <div>
            <button className={`w-17 h-6 h5 rounded-[12px] ${getStatusColor(reservation.status)}`}>
              {reservation.status}
            </button>
          </div>
        </div>
        <div className="flex flex-col border-b-1 border-gray-100 pb-4 gap-2">
          <div className="h4">수의사</div>
          <div className="p">{reservation.vetName} 수의사</div>
        </div>
        <div className="flex flex-col border-b-1 border-gray-100 pb-4 gap-2">
          <div className="h4">병원</div>
          <div className="p">{reservation.hospitalName}</div>
        </div>
        <div className="flex flex-col border-b-1 border-gray-100 pb-4 gap-2">
          <div className="h4">예약 희망 시간</div>
          <div className="p">
            {reservation.reservationDay} <span className="p">{reservation.reservationTime}</span>
          </div>
        </div>
        <div className="flex flex-col border-b-1 border-gray-100 pb-4 gap-2 ">
          <div className="h4">증상</div>
          <div>
            <ImageInputBox src={reservation.photo} />
          </div>
          <div className="p">{reservation.description}</div>
        </div>
      </section>
    </div>
  );
}
