import React, { useState } from 'react';

// 컴포넌트 제작 테스트
import SingleContent from '@/component/text/SingleContent';
import MultipleContent from '@/component/text/MultipleContent';
import ImageContent from '@/component/text/ImageContent';
import SummaryContent from '@/component/text/SummaryContent';
import TreatmentListContent from '@/component/text/TeatmentListContent';
import OwnerAnimalIcon from '@/component/icon/OwnerAnimalIcon';

// Navbar 테스트
import TabGroupWaiting from '@/component/navbar/TabGroupWaiting';
import TabGroupTime from '@/component/navbar/TabGroupTime';
import TabGroupRoles from '@/component/navbar/TabGroupRoles';
import TabGroupPet from '@/component/navbar/TabGroupPet';
import TabGroupTreatList from '@/component/navbar/TabGroupTreatList';


export default function StaffHome() {
  const [selectedTab, setSelectedTab] = useState<string>('대기'); // 대기/승인/반려
  const [selectedTimeTab, setSelectedTimeTab] = useState<string>('진료 가능 시간');  // 진료 가능 시간/예약 목록
  const [selectedRolesTab, setSelectedRolesTab] = useState<string>('반려인'); // 반려인/수의사/병원관계자
  const [selectedPetTab, setSelectedPetTab] = useState<string>('상세정보'); // 상세정보 / 진료내역
  const [selectedTreatListTab, setSelectedTreatListTab] = useState<string>('목록형'); // 목록형/날짜형

  // MultipleContent에 전달할 contents 리스트
  const petInfo = ['이름: 뽀삐', '나이: 3세', '동물 종류: 고양이'];
  return (
    <div>
      <h1>Staff Home</h1>
      <p>여기는 Staff(스태프) 홈 화면입니다.</p>

      {/* 👉 TabGroupWaiting */}
      <div className="mt-6">
        <TabGroupWaiting selected={selectedTab} onSelect={setSelectedTab} />
        <p className="mt-2 text-sm text-gray-600">선택된 탭: {selectedTab}</p>
      </div>

      {/* 👉 TabGroupTime */}
      <div className="mt-6">
        <TabGroupTime selected={selectedTimeTab} onSelect={setSelectedTimeTab} />
        <p className="mt-2 text-sm text-gray-600">선택된 시간탭: {selectedTimeTab}</p>
      </div>

      {/* 👉 TabGroupRoles */}
      <div className="mt-6">
        <TabGroupRoles selected={selectedRolesTab} onSelect={setSelectedRolesTab} />
        <p className="mt-2 text-sm text-gray-600">선택된 시간탭: {selectedRolesTab}</p>
      </div>

      {/* 👉 TabGroupPet */}
      <div className="mt-6">
        <TabGroupPet selected={selectedPetTab} onSelect={setSelectedPetTab} />
        <p className="mt-2 text-sm text-gray-600">선택된 시간탭: {selectedPetTab}</p>
      </div>

      {/* 👉 TabGroupTreatList */}
      <div className="mt-6">
        <TabGroupTreatList selected={selectedTreatListTab} onSelect={setSelectedTreatListTab} />
        <p className="mt-2 text-sm text-gray-600">선택된 시간탭: {selectedTreatListTab}</p>
      </div>


      {/* SingleContent 컴포넌트 사용 */}
      <SingleContent
        title="의사 소개"
        content="안녕하세요 수의사 ○○○입니다. 동물을 사랑하고 빨리 나을 수 있도록 잘 돌보겠습니다."
      />

      {/* MultiContent 컴포넌트 사용 */}
      <MultipleContent title="반려동물 정보" contents={petInfo} />

      {/* 하드코딩된 ImageContent 사용 */}
      <ImageContent title="반려동물 정보" />

      {/* SummaryContent 컴포넌트 사용 */}
      <SummaryContent
        title="AI 요약 진단서"
        content="지금 일어나는 현상은 회복을 하기 위해 발생하는 자연스러운 현상이니 너무 놀라지 않으셔도 됩니다. 잊지 않고 약을 잘 도포해주시고 그 외의 이상이 있다면 다시 진료 신청 부탁드립니다."
      />

      {/* 하드코딩된 TreatmentListContent 사용 */}
      <TreatmentListContent
        time="19:01-19:12"
        department="피부과"
        petName="구름이"
        petInfo="강아지 | 3세"
        status="대기 중"
      />

      <OwnerAnimalIcon />
    </div>
  );
}