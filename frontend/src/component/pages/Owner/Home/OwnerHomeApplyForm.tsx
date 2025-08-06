import React, { useEffect, useRef, useState } from 'react';
import { FiImage } from 'react-icons/fi';
import { useLocation, useNavigate } from 'react-router-dom';
import BackHeader from '@/component/header/BackHeader';
import TimeSelectionDropdown from '@/component/selection/TimeSelectionDropdown';
import ImageInputBox from '@/component/input/ImageInputBox';
import Input from '@/component/input/Input';
import Dropdown from '@/component/selection/SelectionDropdown';
import Button from '@/component/button/Button';
import { useTimeStore } from '@/store/timeStore';

export default function ApplyFormPage() {
  const location = useLocation();
  const { pet, hospital, vet, time } = location.state || {};

  const selectedTime = useTimeStore((state) => state.selectedTime);
  const setSelectedTime = useTimeStore((state) => state.setSelectedTime);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [symptomImage, setSymptomImage] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      setSymptomImage(preview);
    }
  };

  const handleAddClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    setSymptomImage(null);
    fileInputRef.current!.value = '';
  };

  useEffect(() => {
    if (time && !selectedTime) {
      setSelectedTime(time);
    }
  }, [time, selectedTime, setSelectedTime]);

  const [selectedDepartment, setSelectedDepartment] = useState('');
  const symptomRef = useRef<HTMLTextAreaElement | null>(null);

  const handleSubmit = () => {
    const symptomText = symptomRef.current?.value.trim();
    if (!selectedTime) {
      alert('진료 희망 시간을 선택해주세요!');
      return;
    }
    if (!selectedDepartment) {
      alert('진료받을 과를 선택해주세요!');
      return;
    }
    if (!symptomText) {
      alert('증상 내용을 입력해주세요!');
      return;
    }

    navigate('/owner/home/payment');
  };

  return (
    <div className="min-h-screen bg-green-100 flex flex-col">
      <BackHeader text="진료 신청서 작성" />

      <div className="flex-1 overflow-y-auto px-7 py-6 flex flex-col gap-6">
        <TimeSelectionDropdown
          label="진료 희망 시간"
          start_time={vet?.start_time || '09:00'}
          end_time={vet?.end_time || '18:00'}
        />

        {/* 반려동물 정보 */}
        <div>
          <h4 className="h4 mb-2">반려동물 정보</h4>
          <div className="flex gap-4 items-center">
            <ImageInputBox src={pet?.profileImage} />
            <div className="flex flex-col gap-1">
              <p className="h4">{pet?.name || '반려동물 이름'}</p>
              <p className="p text-gray-400">{`${pet?.species || '동물 종류'} | ${pet?.age || '나이'} | ${pet?.gender || '성별'}`}</p>
            </div>
          </div>
        </div>

        {/* 반려인 정보 확인 */}
        <div>
          <h4 className="h4 mb-1">반려인 정보 확인</h4>
          <p className="p">
            본인의 정보 혹은 다른 반려인의 기록에서 불러온 정보가 <strong className=' text-pink-200'>초진 당시 해당 병원에 등록한 반려인 정보</strong>임을 반드시 확인하세요.
          </p>
        </div>

        {/* 이름 / 전화번호 */}
        <Input id="owner-name" label="성명" placeholder="이름을 입력해주세요" value="이대연" disabled />
        <Input id="owner-phone" label="전화번호" placeholder="010-1234-5678" value="010-1234-5678" disabled />

        {/* 증상 */}
        <div>
          <h4 className="h4 mb-2">증상</h4>
          <div className="flex gap-4 mb-4 relative">
            {symptomImage ? (
              <div className="relative w-22 h-22">
                <ImageInputBox src={symptomImage} />
                <button
                  onClick={handleRemoveImage}
                  className="absolute top-[-8px] right-[-8px] w-6 h-6 rounded-full bg-black bg-opacity-60 text-white text-xs flex items-center justify-center"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div
                onClick={handleAddClick}
                className="w-22 h-22 bg-gray-200 rounded-[16px] flex flex-col items-center justify-center cursor-pointer"
              >
                <FiImage className="w-6 h-6 mb-1 text-gray-500" />
                <span className="p text-gray-500">Add</span>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
          </div>

          <Dropdown
          placeholder="진료받을 과를 선택해주세요."
          options={[
            { value: '내과', label: '내과' },
            { value: '외과', label: '외과' },
            { value: '안과', label: '안과' },
            { value: '피부과', label: '피부과' },
          ]}
          value={selectedDepartment}
  onChange={(value) => setSelectedDepartment(value)}
        />


          <textarea
          ref={symptomRef}
          rows={4}
          className="w-full mt-4 p text-black bg-white rounded-2xl border border-gray-400 px-4 py-2 focus:outline-none placeholder:text-gray-500"
          placeholder="어떤 증상이 있는지 입력해주시고, 필요할 경우 사진을 첨부해주세요."
        />
        </div>
      </div>

      <div className="px-6">
        <Button
        color="green"
        text="진료비 결제 수단 선택"
        onClick={handleSubmit}
      />

      </div>
    </div>
  );
}
