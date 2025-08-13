import React, { useEffect, useState, useRef } from 'react';
import '@/styles/main.css';
import SimpleHeader from '@/component/header/SimpleHeader';
import Input from '@/component/input/Input';
import Button from '@/component/button/Button';
import { useNavigate } from 'react-router-dom';

import { getVetMy, updateVetMy } from '@/services/api/Vet/vetmypage';
import type { VetMyResponse } from '@/types/Vet/vetmypageType';
import { authAPI } from '@/services/api/auth';
import { motion } from 'framer-motion';

export default function VetMypage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [license, setLicense] = useState('');
  const [vetName, setVetName] = useState('');
  const [profile, setProfile] = useState('');
  const [photo, setPhoto] = useState('');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleLogout = async () => {
    await authAPI.logout();
    navigate(`/auth/`);
  };

  // 이미지 업로드 핸들러
  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  // 이미지 제거 핸들러
  const handleRemoveImage = () => {
    setProfileImage(null);
    setPreviewImage(null);
  };

  // 파일 선택 핸들러
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // 이미지 미리보기 생성
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // 파일 상태 저장
      setProfileImage(file);
    }
  };
  // 최초 로드: 내 정보 불러오기!!!
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const me: VetMyResponse = await getVetMy();
        setVetName(me?.name ?? '');
        setLicense(me?.license ?? '');
        setProfile(me?.profile ?? '');
        setPhoto(me?.photo ?? '/images/pet_default.png');
      } catch (e) {
        console.error(e);
        setError('수의사 정보를 불러오지 못했어요!');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSubmit = async () => {
    try {
      setSaving(true);
      setError(null);

      // 방어 코드: 필수값 체크!!!
      if (!vetName.trim()) {
        alert('수의사 이름을 입력해주세요!');
        return;
      }
      if (!license.trim()) {
        alert('면허번호가 없습니다! 관리자에게 문의해주세요!');
        return;
      }

      // 프로필 이미지 처리
      const photoToSend = profileImage ? profileImage.name : photo;

      await updateVetMy({
        name: vetName.trim(),
        license: license.trim(), // ← ★ 여기 반드시 포함 ★
        profile: profile.trim(),
        photo: photoToSend,
      });

      alert('수정 완료!');
      navigate('/vet/mypage');
    } catch (e) {
      console.error(e);
      setError('수정에 실패했어요. 잠시 후 다시 시도해주세요!');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <SimpleHeader text="마이페이지" />
      <div className="flex flex-col gap-6 px-7 mt-11">
        {/* 병원코드 입력 제거 완료!!! */}
        <Input id="name" label="이름" value={vetName} onChange={(e) => setVetName(e.target.value)} disabled={loading} />
        <Input id="license" label="면허번호" value={license} disabled />
        <div className="flex flex-col">
          <label htmlFor="profile" className="mb-2 block h4 text-black">
            수의사 소개글
          </label>
          <textarea
            id="profile"
            value={profile}
            onChange={(e) => setProfile(e.target.value)}
            placeholder={loading ? '불러오는 중…' : '소개글을 입력해주세요'}
            className="w-full h-30 block border-1 rounded-[12px] border-gray-400 px-5 pt-3 pb-3 text-black placeholder:text-gray-500 resize-none align-top whitespace-pre-wrap break-words scrollbar-hide"
            disabled={loading}
          />
          {error && <p className="caption text-red-500 mt-1">{error}</p>}
        </div>
        <div>
          <label className="block h4 text-black mb-2">프로필 사진</label>
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
          <div className="flex items-center gap-4">
            <div className="w-22 h-22 bg-green-100 border-3 border-green-200 rounded-[12px] flex items-center justify-center overflow-hidden">
              <img
                src={previewImage || photo || '/images/pet_default.png'}
                alt="프로필 사진"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                className="text-white bg-green-300 px-4 py-1 rounded-xl h5 cursor-pointer"
                onClick={handleImageUpload}
                disabled={loading}
              >
                사진 등록
              </button>
              <button
                type="button"
                className="text-gray-400 bg-gray-100 px-4 py-1 rounded-xl h5 cursor-pointer"
                onClick={handleRemoveImage}
                disabled={loading}
              >
                사진 제거
              </button>
            </div>
          </div>
        </div>
      </div>
      <br />
      <div className="px-7">
        <Button text={saving ? '수정 중…' : '수정하기'} onClick={handleSubmit} color="green" />
      </div>
      <div className="flex justify-center gap-2 mt-2 px-7">
        <motion.button
          className="h4 text-center text-gray-500 cursor-pointer"
          onClick={handleLogout}
          whileHover={{ scale: 1.05 }} // hover시 효과 추가
          transition={{ duration: 0.2 }}
        >
          로그 아웃
        </motion.button>
      </div>
    </>
  );
}
