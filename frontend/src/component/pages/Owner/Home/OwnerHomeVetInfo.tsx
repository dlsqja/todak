import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import BackHeader from '@/component/header/BackHeader';
import SingleContent from '@/component/text/SingleContent';
import TimeSelectionButton from '@/component/selection/TimeSelectionButton';
import Button from '@/component/button/Button';
import { useTimeStore } from '@/store/timeStore';

export default function VetInfoPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const pet = location.state?.pet;
  const hospital = location.state?.hospital;
  const vet = location.state?.vet;

  const selectedTime = useTimeStore((state) => state.selectedTime);

  const handleSubmit = () => {
    if (!selectedTime) {
      alert('시간을 선택해주세요!');
      return;
    }

    navigate('/owner/home/form', {
      state: {
        pet,
        hospital,
        vet,
        time: selectedTime,
      },
    });
  };

  return (
    <div className="min-h-screen bg-green-100 flex flex-col">
      <BackHeader text="수의사 정보" />

      {/* 스크롤 가능한 콘텐츠 영역 */}
      <div className="flex-1 overflow-y-auto px-7 py-6 flex flex-col gap-3">
        {/* 프로필 사진 */}
        <div className="w-full h-[200px] bg-gray-100 rounded-[12px] flex items-center justify-center text-gray-400">
          수의사 프로필 사진
        </div>

        {/* 수의사 이름 */}
        <div>
          <h3 className="h3 mt-1">{vet?.name || '수의사 이름'}</h3>
          <h4 className="h4 text-gray-400">
            {hospital?.name} · 진료 가능 시간 {vet?.start_time}~{vet?.end_time} · {vet?.specialty || '취급 동물'}
          </h4>
        </div>

        <SingleContent title="의사 소개" content={vet?.description || '의사 소개 정보가 없습니다.'} />
        <SingleContent title="병원 정보" content={hospital?.description || '병원 소개글이 없습니다.'} />
        <SingleContent title="병원 위치" content={hospital?.address || '병원 주소가 없습니다.'} />

        <div>
          <h4 className="h4 mb-2">진료 가능 시간</h4>
          <TimeSelectionButton
            start_time={vet?.start_time || '09:00'}
            end_time={vet?.end_time || '18:00'}
          />
        </div>
      </div>

      {/* 고정 버튼 영역 */}
      <div className="px-7 bg-green-100">
        <Button
          color="green"
          text="진료 신청서 작성하러 가기"
          onClick={handleSubmit}
        />
      </div>
    </div>
  );
}
