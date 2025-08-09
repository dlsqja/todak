import React from 'react';
import '@/styles/main.css';
import { Navigate, useNavigate } from 'react-router-dom';
import OwnerTreatmentSimpleCard from '@/component/card/OwnerTreatmentSimpleCard';

export default function StaffHome() {
  const navigate = useNavigate();
  const dummyReservations: { vet_name: string; time: string; pet: string; petinfo: string }[] = [
    { vet_name: '이대연', time: '10:00', pet: '초코', petinfo: '강아지 / 3세 / 여(중성화)' },
    { vet_name: '김유성', time: '11:00', pet: '뽀삐', petinfo: '강아지 / 3세 / 여(중성화)' },
    { vet_name: '김유성', time: '11:00', pet: '미료', petinfo: '강아지 / 3세 / 여(중성화)' },
  ];

  return (
    <div>
      <h3 className="h3 mx-7 pt-13">OOO 관계자님 반갑습니다!</h3>
      <h3 className="h3 mx-7 mb-2">어플 사용이 처음이신가요?</h3>
      <button
        onClick={() => navigate('/home/guide')}
        className="h5 mx-7 px-5 py-1 rounded-full inline-block 
        bg-green-300 text-green-100 hover:bg-green-200 transition"
      >
        비대면 진료 가이드
      </button>
      <h3 className="mx-7 h3 mt-11">예약 신청 목록</h3>
      <div className="overflow-x-auto overflow-visible snap-x snap-mandatory scroll-smooth hide-scrollbar mx-7 pt-3 pb-6">
        <div className="w-max flex gap-4 h-full p-3">
          {dummyReservations.map((reservation) => (
            <div className="p-3 bg-white rounded-[12px] shadow-[0px_5px_15px_rgba(0,0,0,0.08)] ">
              <h4 className="h4 text-black">{reservation.time}</h4>
              <h4 className="h4 text-black">{reservation.vet_name} 수의사님</h4>
              <p className="p mt-1 text-black">{reservation.pet}</p>
              <p className="p mt-2 text-black">{reservation.petinfo}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
