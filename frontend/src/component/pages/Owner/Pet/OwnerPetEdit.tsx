import '@/styles/main.css';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

import BackHeader from '@/component/header/BackHeader';
import ImageInputBox from '@/component/input/ImageInputBox';
import Input from '@/component/input/Input';
import Button from '@/component/button/Button';
import SelectionDropdown from '@/component/selection/SelectionDropdown';

import { getPetDetail, updatePet } from '@/services/api/Owner/ownerpet';

export default function OwnerPetEdit() {
  const DEFAULT_IMAGE = '/images/pet_default.png';
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [selectedImage, setSelectedImage] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDefaultImage, setIsDefaultImage] = useState(false);
  const [updatePhoto, setUpdatePhoto] = useState(false);

  const [name, setName] = useState('');
  const [age, setAge] = useState('');           // 문자열로 유지
  const [weight, setWeight] = useState('');
  const [gender, setGender] = useState('');
  const [type, setType] = useState('');

  const { state } = useLocation();
  const selectedPet = state?.pet;

  // 드롭다운 하나만 열리기
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);

  useEffect(() => {
    const fetchPetDetail = async () => {
      try {
        const res = await getPetDetail(id);
        const pet = res.data;

        const photoUrl = pet.photo ? `${import.meta.env.VITE_PHOTO_URL}${pet.photo}` : DEFAULT_IMAGE;

        setName(pet.name);
        setAge(String(pet.age ?? ''));
        setWeight(String(pet.weight ?? ''));
        setGender(pet.gender);
        setType(pet.species);

        setSelectedImage(photoUrl);
        setIsDefaultImage(!pet.photo);
      } catch (err) {
        console.log(err);
        alert('반려동물 정보를 불러오지 못했습니다.');
      }
    };
    fetchPetDetail();
  }, [id]);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const MAX_FILE_SIZE = 30 * 1024 * 1024; // 30MB
      if (file.size > MAX_FILE_SIZE) {
        alert('파일 크기가 너무 큽니다. 30MB 이하의 이미지를 선택해주세요.');
        event.target.value = '';
        return;
      }
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setSelectedFile(file);
      setIsDefaultImage(false);
      setUpdatePhoto(false);
    }
    event.target.value = '';
  };

  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    if (window.confirm('사진을 제거하시겠습니까?')) {
      setSelectedImage('');
      setSelectedFile(null);
      setIsDefaultImage(true);
      setUpdatePhoto(true);
    }
  };

  // ===== 나이: 양수 정수만 허용 (1~100) =====
  const sanitizeAgeInput = (v: string) => {
    // 숫자만 남김 (소수점 제거)
    return v.replace(/[^\d]/g, '');
  };
  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAge(sanitizeAgeInput(e.target.value));
  };
  const validateAndNormalizeAge = (ageStr: string): number | null => {
    const s = (ageStr ?? '').trim();
    if (!/^\d+$/.test(s)) return null;      // 정수만
    const num = parseInt(s, 10);
    if (!Number.isFinite(num)) return null;
    if (num < 1 || num > 100) return null;  // 양수(최소 1)
    return num;                             // 그대로 정수 반환
  };

  // ===== 몸무게: 입력 정리(한 자리 소수까지) + 유효성(0~200) =====
  const sanitizeWeightInput = (v: string) => {
    // 음수 제거, 숫자/점만 허용
    const noMinus = v.replace(/-/g, '');
    let cleaned = noMinus.replace(/[^\d.]/g, '');

    // 점은 첫 번째 것만 유지
    const firstDot = cleaned.indexOf('.');
    if (firstDot !== -1) {
      cleaned =
        cleaned.slice(0, firstDot + 1) + cleaned.slice(firstDot + 1).replace(/\./g, '');
    }

    // 소수 한 자리, 단 입력 중엔 '2.' 처럼 끝 점 유지
    const [i = '', d] = cleaned.split('.');
    if (d === undefined) return i;        // 정수만
    if (d === '') return `${i}.`;         // 끝 점 유지
    return `${i}.${d.slice(0, 1)}`;       // 소수 한 자리
  };

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWeight(sanitizeWeightInput(e.target.value));
  };

  const validateAndNormalizeWeight = (weightStr: unknown): number | null => {
    const s = String(weightStr ?? '').trim();
    if (!s) return null;
    if (!/^\d+(\.\d)?$/.test(s)) return null;      // 정수 또는 소수 1자리(음수 불가)
    const num = Number.parseFloat(s);
    if (!Number.isFinite(num)) return null;
    if (num < 0 || num > 200) return null;
    return Math.round(num * 10) / 10;              // 소수 1자리 고정
  };

  const handleSubmit = async () => {
  // 나이 유효성
  const normalizedAge = validateAndNormalizeAge(age);
  if (normalizedAge === null) {
    alert('나이는 1~100 사이의 양수 정수만 입력할 수 있어요.\n예) 6, 12, 100');
    return;
  }
  setAge(String(normalizedAge));

  // 몸무게 유효성
  const normalizedWeight = validateAndNormalizeWeight(weight);
  if (normalizedWeight === null) {
    alert('몸무게는 0 이상 200 이하의 숫자로 입력해주세요.\n예) 3 또는 3.5 (소수 한 자리까지)');
    return;
  }
  const weightFixed = Number(Math.round(normalizedWeight * 10) / 10); // number(소수1자리)
  setWeight(weightFixed.toFixed(1)); // UI 표시 보정

  try {
    // ✅ 서버 호환을 위해 여러 필드 동시 전송
    const petRequest: any = {
      name,
      age: normalizedAge,                // number
      gender: String(gender),
      species: type,
      updatePhoto: updatePhoto,

      // --- weight 변형 버전들(백엔드 어떤 이름이든 잡히게) ---
      weight: weightFixed,               // 가장 일반적
      weightKg: weightFixed,             // camelCase 변형
      weight_kg: weightFixed,            // snake_case 변형
      weightGram: Math.round(weightFixed * 1000), // 정수형만 받는 서버 대비(그램)
      weight_g: Math.round(weightFixed * 1000),
      weight_str: weightFixed.toFixed(1),          // 문자열만 파싱하는 서버 대비
    };

    // console.log('[updatePet] payload:', petRequest);

    await updatePet({
      id: Number(id),
      petRequest,
      photo: isDefaultImage || selectedImage === '' ? null : selectedFile,
    });

    alert('수정되었습니다');
    navigate('/owner/pet');
  } catch (err) {
    console.error('🛑 반려동물 수정 실패:', err);
    alert('수정에 실패했습니다.');
  }
};


  return (
    <div className="pb-20 space-y-6">
      <BackHeader text="반려동물 수정" />
      <div className="px-7 space-y-6">
        {/* 이미지 */}
        <div className="flex justify-center gap-3">
          <ImageInputBox
            src={selectedImage}
            stroke={isDefaultImage ? 'border-green-200' : 'border-gray-300'}
          />
          <input type="file" ref={fileInputRef} onChange={handleImageSelect} accept="image/*" className="hidden" />
          <div className="pt-4">
            <button className="w-full h-6 rounded-[12px] h5 bg-green-300 text-green-100" onClick={handleImageUpload}>
              사진 등록
            </button>
            <button className="w-full h-6 rounded-[12px] h5 bg-gray-100 text-gray-500" onClick={handleRemoveImage}>
              사진 제거
            </button>
          </div>
        </div>

        {/* 입력폼 */}
        <div className="space-y-5">
          <Input
            id="name"
            label="이름"
            placeholder="이름 입력"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <div className="flex gap-4">
            <Input
              id="age"
              label="나이"
              placeholder="예) 6"
              value={age}
              onChange={handleAgeChange}
            />
            <Input
              id="weight"
              label="무게"
              placeholder="0"
              value={weight}
              onChange={handleWeightChange}
            />
          </div>

          <div className="w-full flex flex-col">
            <label className="h4 mb-2 text-black">성별 선택</label>
            <SelectionDropdown
              dropdownId="pet-edit-gender"
              activeDropdown={activeDropdownId}
              setActiveDropdown={setActiveDropdownId}
              value={gender}
              onChange={(val) => setGender(val)}
              options={[
                { value: 'MALE_NEUTERING', label: '남 (중성화)' },
                { value: 'FEMALE_NEUTERING', label: '여 (중성화)' },
                { value: 'NON', label: '성별 없음' },
                { value: 'MALE', label: '남' },
                { value: 'FEMALE', label: '여' },
              ]}
              placeholder="성별 선택"
            />
          </div>

          <div className="flex flex-col">
            <label className="h4 mb-2 text-black">종</label>
            <SelectionDropdown
              dropdownId="pet-edit-species"
              activeDropdown={activeDropdownId}
              setActiveDropdown={setActiveDropdownId}
              value={type}
              onChange={(val) => setType(val)}
              options={[
                { value: 'DOG', label: '강아지' },
                { value: 'CAT', label: '고양이' },
                { value: 'OTHER', label: '기타' },
              ]}
              placeholder="종 선택"
            />
          </div>
        </div>

        <div className="mt-6">
          <Button text="수정 완료하기" color="green" onClick={handleSubmit} />
        </div>
      </div>
    </div>
  );
}
