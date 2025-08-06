import React, {useState} from 'react';
import SimpleHeader from '@/component/header/SimpleHeader';
import SingleContent from '@/component/text/SingleContent';
import MultiContent from '@/component/text/MultipleContent';
import ImageInputBox from '@/component/input/ImageInputBox';
import Button from '@/component/button/Button';
import { useLocation } from 'react-router-dom';
import ReservationApprovalModal from './StaffReservationApprovalModal';
import StaffReservationRejectModal from './StaffReservationRejectModal';

export default function StaffReservationDetail() {
  const { state } = useLocation();
  const { time, doctor, pet, owner } = state || {};
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDenialModalOpen, setIsDenialModalOpen] = useState(false);
  return (
    <div className="space-y-6">
      <SimpleHeader text="예약 상세" />
    <div className='px-7 '>
      {/* 반려동물 정보 */}
      <MultiContent
        title="반려동물 정보"
        contents={['이름 : 뽀삐', '나이 : 3세', '동물 종류 : 고양이']}
      />

      {/* 보호자 정보 */}
      <MultiContent
        title="보호자 정보"
        contents={['이름 : 안성수', '생년월일 : 000101', '전화번호 : 010-1234-5678']}
      />

      {/* 재진 여부 */}
      <SingleContent title="재진 여부" content={
    <>
      초진 <span className="text-red-500">(진료 불가)</span>
    </>
  } />

      {/* 알림 문구 */}
      <p className="caption my-3 text-center text-gray-400 border border-gray-100 bg-gray-100 rounded-[12px] py-3">
        앱 데이터베이스 상으로 진료 등록된 기록이 없습니다.<br />
        정확한 정보는 병원의 기록으로 판단 바랍니다.
      </p>

      {/* 수의사 및 진료과목 */}
      <SingleContent title="희망 수의사 및 진료 과목" content="송인범 원장 | 피부과" />

      {/* 예약 희망 시간 */}
      <SingleContent title="예약 희망 시간" content="2025. 07. 25. 9:00" />

      {/* 증상 */}
      <div className="space-y-4">
        <h4 className="h4">증상</h4>
        <div className="flex gap-4">
          <ImageInputBox stroke="border border-gray-300" />
        </div>
        <p className="p">
          피부에 뭐가 나서 저번에 병원에 가서 연고 발라주고 했는데도 계속 붓는 기운이 있는 것 같아요.
          오히려 조금 뭐가 올라오는 것 같을 때는 어떡해야 할지를 모르겠네요. 약이 이상한 건가요???
        </p>
      </div>

      {/* 버튼 2개 */}
<div className="grid grid-cols-2 gap-4 pt-4">
  <Button color="lightgreen" text="진료 반려" onClick={() => setIsDenialModalOpen(true)} />
  <Button color="green" text="진료 승인" onClick={() => setIsModalOpen(true)} />
</div>

{/* 승인 모달 */}
{isModalOpen && (
  <ReservationApprovalModal
    onClose={() => setIsModalOpen(false)}
    data={{
      time: '2025. 07. 25. 9:00~9:30',
      doctor: '송인범 원장',
      department: '피부과',
      petName: '뽀삐',
      petAge: '3세',
      petType: '고양이',
      ownerName: '안성수',
      ownerPhone: '010-1234-5678',
    }}
  />
)}

{/* 반려 모달 */}
{isDenialModalOpen && (
  <StaffReservationRejectModal
    onClose={() => setIsDenialModalOpen(false)}
    onSubmit={(reasonType, detail) => {
      console.log('반려 사유 타입:', reasonType);
      console.log('반려 상세 내용:', detail);
      setIsDenialModalOpen(false);
    }}
    petName="뽀삐"
    petInfo="고양이 / 3세"
    time="9:00"
    doctor="송인범"
    photo=""
  />
)}

    </div>
    </div>
  );
}
