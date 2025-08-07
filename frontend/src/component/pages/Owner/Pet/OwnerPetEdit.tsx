// 주소 : /owner/pet/edit/:id
// 주소 : /owner/pet/edit/:id

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
  const fileInputRef = useRef(null);

  const [selectedImage, setSelectedImage] = useState(DEFAULT_IMAGE);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDefaultImage, setIsDefaultImage] = useState(true);

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [gender, setGender] = useState('');
  const [neutered, setNeutered] = useState('');
  const [type, setType] = useState('');
  const { state } = useLocation();
  const selectedPet = state?.pet;


  // 데이터 불러오기
  useEffect(() => {
    const fetchPetDetail = async () => {
      try {
        const res = await getPetDetail(id);
        const pet = res.data;
        setName(pet.name);
        setAge(String(pet.age));
        setWeight(pet.weight);
        setGender(pet.gender);
        setNeutered(pet.neutered);
        setType(pet.type);
        setSelectedImage(pet.photoUrl || DEFAULT_IMAGE);
        setIsDefaultImage(!pet.photoUrl);
      } catch (err) {
        console.log(err)
        alert('반려동물 정보를 불러오지 못했습니다.');
      }
    };
    fetchPetDetail();
  }, [id]);

  const handleImageSelect = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);

      setSelectedImage(imageUrl);
      setSelectedFile(file);
      setIsDefaultImage(false);
    }
    event.target.value = '';
  };

  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    if (window.confirm('사진을 제거하시겠습니까?')) {
      setSelectedImage(DEFAULT_IMAGE);

      setSelectedFile(null);
      setIsDefaultImage(true);
    }
  };

  const handleSubmit = async () => {
    try {
      const petRequest = {
        name,
        age: Number(age),
        weight,
        gender,
        neutered,
        type,
      };

      await updatePet({
        id : Number(id),
        petRequest,
        photo: isDefaultImage ? null : selectedFile,
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
          <ImageInputBox src={selectedImage} stroke={isDefaultImage ? 'border-pink-100' : 'border-green-100'} />
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
          <Input id="name" label="이름" placeholder="이름 입력" value={name} onChange={(e) => setName(e.target.value)} />
          <div className="flex gap-4">
            <Input id="age" label="나이" placeholder="0" value={age} onChange={(e) => setAge(e.target.value)} />
            <Input id="weight" label="무게" placeholder="0" value={weight} onChange={(e) => setWeight(e.target.value)} />
          </div>

          <div className="flex gap-4">
            <div className="w-full flex flex-col">
              <label className="h4 mb-2 text-black">성별</label>

              <SelectionDropdown
                value={gender}
                onChange={(val) => setGender(val)}
                options={[
                  { value: '남', label: '남' },
                  { value: '여', label: '여' },
                ]}
                placeholder="성별을 선택해주세요"
              />
            </div>
            <div className="w-full flex flex-col">
              <label className="h4 mb-2 text-black">중성화 여부</label>

              <SelectionDropdown
                value={neutered}
                onChange={(val) => setNeutered(val)}
                options={[
                  { value: '예', label: '예' },
                  { value: '아니오', label: '아니오' },
                ]}
                placeholder="중성화 여부 선택"
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label className="h4 mb-2 text-black">종</label>
            <SelectionDropdown
              value={type}
              onChange={(val) => setType(val)}
              options={[
                { value: '강아지', label: '강아지' },
                { value: '고양이', label: '고양이' },
                { value: '기타', label: '기타' },
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