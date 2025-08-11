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

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [gender, setGender] = useState('');
  // const [neutered, setNeutered] = useState('');
  const [type, setType] = useState('');

  const { state } = useLocation();
  const selectedPet = state?.pet;

  // const genderMap = {
  //   '남(중성화)': 'MALE_NEUTERING',
  //   '여(중성화)': 'FEMALE_NEUTERING',
  //   '남': 'MALE',
  //   '여': 'FEMALE',
  //   '성별 없음': 'NON',
  // };

  // const typeMap = { 강아지: 'DOG', 고양이: 'CAT', 기타: 'OTHER' };

  // 데이터 불러오기
  useEffect(() => {
    const fetchPetDetail = async () => {
      try {
        const res = await getPetDetail(id);
        const pet = res.data;

        console.log('Pet Details:', pet);
        console.log('Pet Photo:', pet.photo); // pet.photo 값 확인

        const photoUrl = pet.photo ? `${import.meta.env.VITE_PHOTO_URL}${pet.photo}` : DEFAULT_IMAGE;

        setName(pet.name);
        setAge(String(pet.age));
        setWeight(pet.weight);
        setGender(pet.gender);
        setType(pet.species);

        setSelectedImage(photoUrl);
        setIsDefaultImage(!pet.photo); // photo 값이 없으면 기본 이미지로 처리
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
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setSelectedFile(file);
      setIsDefaultImage(false);
    }
    event.target.value = ''; // Reset file input
  };

  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    if (window.confirm('사진을 제거하시겠습니까?')) {
      setSelectedImage('');
      setSelectedFile(null);
      setIsDefaultImage(true);
    }
  };

  const handleSubmit = async () => {
    try {
      const petRequest = {
        name,
        age: Number(age),
        gender: String(gender),
        species: type,
        weight: parseFloat(weight),
      };

      console.log('Pet Request:', petRequest); // 로그로 요청값 확인

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
            src={selectedImage} // 선택된 이미지 미리보기
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
            <Input id="age" label="나이" placeholder="0" value={age} onChange={(e) => setAge(e.target.value)} />
            <Input
              id="weight"
              label="무게"
              placeholder="0"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
          </div>

          <div className="w-full flex flex-col">
            <label className="h4 mb-2 text-black">성별 선택</label>
            <SelectionDropdown
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
