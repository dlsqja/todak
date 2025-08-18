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
import { getOwnerInfo } from '@/services/api/Owner/ownermypage';
import type { OwnerResponse } from '@/types/Owner/ownermypageType';
import { genderMapping } from '@/utils/genderMapping';
import { speciesMapping } from '@/utils/speciesMapping';
import type { CreateOwnerReservationData } from '@/types/Owner/ownerreservationType';
import { timeMapping } from '@/utils/timeMapping';
import apiClient from '@/plugins/axios';
import { createReservation } from '@/services/api/Owner/ownerreservation';

export default function ApplyFormPage() {
  const location = useLocation();
  const { pet, hospital, vet, time, startTime, endTime, usableTimes } = location.state || {};

  const selectedTime = useTimeStore((s) => s.selectedTime);
  const setSelectedTime = useTimeStore((s) => s.setSelectedTime);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // 미리보기용 사진
  const [symptomImage, setSymptomImage] = useState<string | null>(null);
  // 실제 업로드할 증상 사진
  const [symptomFile, setSymptomFile] = useState<File | null>(null);

  const [owner, setOwner] = useState<OwnerResponse | null>(null);
  const [ownerLoading, setOwnerLoading] = useState(false);
  const [ownerError, setOwnerError] = useState<string | null>(null);
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);

  const navigate = useNavigate();

  const buildPhotoUrl = (photo?: string | null) => {
    if (!photo) return '/images/pet_default.png';
    if (photo.startsWith('http')) return photo;
    const base = import.meta.env.VITE_PHOTO_URL || '';
    return `${base}${photo}`;
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      setSymptomImage(preview); // 프리뷰용!!!
      setSymptomFile(file); // 업로드용!!!
    }
  };

  const handleAddClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    if (symptomImage) URL.revokeObjectURL(symptomImage);
    setSymptomImage(null);
    setSymptomFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  useEffect(() => {
    return () => {
      if (symptomImage) URL.revokeObjectURL(symptomImage);
    };
  }, [symptomImage]);

  useEffect(() => {
    if (time && time !== selectedTime) {
      setSelectedTime(time);
    }
  }, [time, selectedTime, setSelectedTime]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setOwnerLoading(true);
        const data = await getOwnerInfo();
        if (!alive) return;
        setOwner(data);
      } catch (err) {
        if (!alive) return;
        setOwnerError('반려인 정보를 불러오지 못했어요!');
      } finally {
        if (!alive) return;
        setOwnerLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const [selectedDepartment, setSelectedDepartment] = useState('');
  const symptomRef = useRef<HTMLTextAreaElement | null>(null);

  // 매핑 라벨 보조
  const mapEnumLabel = (map: Record<string, string>, raw?: unknown, emptyLabel = '') => {
    if (!raw) return emptyLabel;
    const key = String(raw).toUpperCase().replace(/[\s-]/g, '_');
    return map[key] ?? String(raw);
  };

  const speciesLabel = mapEnumLabel(speciesMapping, pet?.species, '동물 종류');
  const genderLabel = mapEnumLabel(genderMapping, pet?.gender, '성별');

  // ✅ 추가: 'HH:mm' → 슬롯 인덱스(0~47)
  const timeToSlotIndex = (hhmm: string): number | undefined => {
    for (const [k, v] of Object.entries(timeMapping)) {
      if (v === hhmm) return Number(k);
    }
    return undefined;
  };

  const handleSubmit = async () => {
    const symptomText = symptomRef.current?.value?.trim();
    if (!selectedTime) return alert('진료 희망 시간을 선택해주세요!');
    if (!selectedDepartment) return alert('진료받을 과를 선택해주세요!');
    if (!symptomText) return alert('증상 내용을 입력해주세요!');

    const petIdRaw = (pet?.pet_id ?? pet?.petId ?? pet?.id) as string | undefined;
    const hospitalIdRaw = (hospital?.hospital_id ?? hospital?.hospitalId ?? hospital?.id) as string | undefined;
    const vetIdRaw = (vet?.vet_id ?? vet?.vetId ?? vet?.id) as string | undefined;

    if (!petIdRaw || !hospitalIdRaw) {
      return alert('필수 정보가 누락되었습니다! (반려동물/병원 식별자 확인)');
    }

    const slot = timeToSlotIndex(String(selectedTime));
    if (slot === undefined) return alert('선택한 시간이 올바르지 않습니다!');

    const reservationDay = (location.state && location.state.reservationDay) || new Date().toISOString().slice(0, 10); // YYYY-MM-DD

    const draft: CreateOwnerReservationData = {
      petId: String(petIdRaw), // ✔ 문자열로 고정
      hospitalId: String(hospitalIdRaw), // ✔ 문자열로 고정
      vetId: vetIdRaw ? String(vetIdRaw) : undefined, // ✔ 문자열
      subject: selectedDepartment,
      description: symptomText,
      reservationDay,
      reservationTime: slot,
      status: 'REQUESTED',
    };

    const res = await createReservation(draft, symptomFile);

    navigate('/owner/home/payment');
  };

  return (
    <div className="min-h-screen  bg-[#FAFAF9] flex flex-col">
      <BackHeader text="진료 신청서 작성" />

      <div className="flex-1 overflow-y-auto px-7 py-6 flex flex-col gap-6">
        <TimeSelectionDropdown label="진료 희망 시간" start_time={startTime || '09:00'} end_time={endTime || '18:00'} disabled/>

        {/* 반려동물 정보 */}
        <div>
          <h4 className="h4 mb-2">반려동물 정보</h4>
          <div className="flex gap-4 items-center">
            <ImageInputBox src={buildPhotoUrl(pet?.photo ?? pet?.profileImage)} stroke="border-5 border-green-200" />
            <div className="flex flex-col gap-1">
              <p className="h4">{pet?.name || '반려동물 이름'}</p>
              <p className="p text-gray-500">{`${speciesLabel} | ${pet?.age ?? '나이'}세 | ${genderLabel}`}</p>
            </div>
          </div>
        </div>

        {/* 반려인 정보 확인 */}
        <div>
          <h4 className="h4 mb-1">반려인 정보 확인</h4>
          <p className="p">
            본인의 정보 혹은 다른 반려인의 기록에서 불러온 정보가{' '}
            <strong className=" text-pink-200">초진 당시 해당 병원에 등록한 반려인 정보</strong>임을 반드시 확인하세요.
          </p>
        </div>

        {/* 이름 / 전화번호 */}
        <div className="mt-3 flex flex-col gap-4">
          <Input
            id="owner-name"
            label="성명"
            placeholder={ownerLoading ? '불러오는 중…' : '이름을 입력해주세요'}
            value={owner?.name ?? ''}
            disabled
          />
          <Input
            id="owner-phone"
            label="전화번호"
            placeholder={ownerLoading ? '불러오는 중…' : '010-0000-0000'}
            value={owner?.phone ?? ''}
            disabled
          />
          {/* 원하면 에러 메시지 표시
          {ownerError && <p className="text-sm text-red-500">{ownerError}</p>} */}
        </div>

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
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
          </div>

          <Dropdown
  placeholder="진료받을 과를 선택해주세요."
  options={[
    { value: 'DENTAL',        label: '치과' },
    { value: 'OPHTHALMOLOGY', label: '안과' },
    { value: 'ORTHOPEDICS',   label: '정형외과' },
    { value: 'DERMATOLOGY',   label: '피부과' },
  ]}
  value={selectedDepartment}
  onChange={(value) => setSelectedDepartment(value)}
  dropdownId="applyform-department"          // ✅ 고유 id
  activeDropdown={activeDropdownId}          // ✅ 현재 열린 드롭다운 id
  setActiveDropdown={setActiveDropdownId}    // ✅ setter
/>

          <textarea
            ref={symptomRef}
            rows={4}
            className={`
              w-full mt-4 p text-black bg-white rounded-2xl px-4 py-2
              border border-gray-400 placeholder:text-gray-500
              focus:outline-none focus:border-green-300 focus:ring-1 focus:ring-green-200  focus:border-2
              transition-all duration-200 ease-in-out
            `}
            placeholder="어떤 증상이 있는지 입력해주시고, 필요할 경우 사진을 첨부해주세요."
          />
        </div>
      </div>

      <div className="px-6">
        <Button color="green" text="진료비 결제 수단 선택" onClick={handleSubmit} />
      </div>
    </div>
  );
}
