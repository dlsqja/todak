import React from 'react';
import { Outlet } from 'react-router-dom';
import '@/styles/main.css';
import OwnerTreatmentSimpleCard from "@/component/card/OwnerTreatmentSimpleCard";
import TreatmentSlideList from "@/component/card/TreatmentSlideList";
import PetProfileCard from '@/component/card/PetProfileCard';
import TreatmentRecordCard from '@/component/card/TreatmentRecordCard';
import SearchListItem from '@/component/card/SearchListItem';
import RemoteTreatmentCard from '@/component/card/RemoteTreatmentCard';


export default function OwnerHome() {
  return (
    <div>
      <h1 className='h1'>Owner 홈</h1>
      <p>여기는 Owner 홈 화면입니다.</p>
      <Outlet />

      <div className="mt-10">
        <h2 className="text-lg font-semibold mb-2">📱 비대면 진료 예약</h2>
        <RemoteTreatmentCard
          petName="뽀삐"
          petInfo="강아지 / 3세"
          department="피부과"
          symptom="눈꼽이 많이 껴요."
          time="17:00"
          onDetailClick={() => console.log("상세 정보 클릭됨!")}
          onTreatClick={() => console.log("진료 받기 클릭됨!")}
        />
      </div>
      <div className="mt-10">
      {/* 🆕 최근 방문 병원 리스트 */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold mb-2">🏥 최근 방문한 병원</h2>
        <div>
          <SearchListItem
            name="병원 이름 1"
            description="서울시 강남구 강남대로 123"
            onClick={() => console.log("병원 1 클릭!")}
          />
          <SearchListItem
            name="병원 이름 2"
            description="서울시 강남구 강남대로 124"
            onClick={() => console.log("병원 2 클릭!")}
          />
        </div>
      </div>
  <h2 className="text-lg font-semibold mb-2">🩺 진료 내역 카드</h2>
  <TreatmentRecordCard
    doctorName="이대연"
    hospitalName="21세기동물병원"
    treatmentDate="2025.07.20"
    department="피부과"
    onClickDetail={() => console.log("상세보기 클릭됨!")}
  />
</div>

      <PetProfileCard
  name="미료"
  genderAge="여 (중성)"
  breedAge="비숑 9세"
  weight="4.1kg"
/>

      <OwnerTreatmentSimpleCard
      time="24:00-24:30"
      department="안과"
      petName="뽀삐"
      petInfo="강아지 / 3세 / 여(중성화)"
    />

    <div className="mt-10">
        <h2 className="text-lg font-semibold mb-2">🌀 예약 카드 슬라이드</h2>
        <TreatmentSlideList /> {/* ✅ 여기에 사용 */}
      </div>
    </div>
  );
}