// src/component/pages/Vet/VetMypage.tsx
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

// 렌더용 src 계산기: 절대 URL/데이터URL/상대경로 모두 대응
// const resolvePhotoSrc = (val?: string | null): string => {
//   if (!val) return DEFAULT_PHOTO;
//   const s = String(val).trim();
//   if (!s) return DEFAULT_PHOTO;
//   if (/^(https?:)?\/\//i.test(s)) return s; // http(s):// or //cdn...
//   if (/^(data:|blob:)/i.test(s)) return s; // data URL / blob
//   if (s.startsWith('/')) return s; // 절대 경로
//   return `/${s}`; // 상대경로 -> 절대로
// };
const photoUrl = import.meta.env.VITE_PHOTO_URL;
const DEFAULT_PHOTO = '/images/person_default.png';

export default function VetMypage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [license, setLicense] = useState('');
  const [vetName, setVetName] = useState('');
  const [profile, setProfile] = useState('');

  // 서버 전송용(원본 문자열)과 화면 표시용(src) 분리
  // const [photoRaw, setPhotoRaw] = useState<string>(''); // 서버로 보낼 값
  const [photoSrc, setPhotoSrc] = useState<string>(DEFAULT_PHOTO); // img src

  // 업로드/미리보기
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogout = async () => {
    await authAPI.logout();
    navigate(`/auth/`);
  };

  // 이미지 업로드 핸들러
  const handleImageUpload = () => fileInputRef.current?.click();

  // 이미지 제거: DB엔 저장하지 않음, 화면만 기본이미지로
  const handleRemoveImage = () => {
    setProfileImage(null);
    setPreviewImage(null);
    // setPhotoRaw(''); // 전송값 비움(기본이미지는 저장 안 함)
    setPhotoSrc(DEFAULT_PHOTO); // 화면은 기본 이미지
  };

  // 파일 선택 -> 미리보기 세팅
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => setPreviewImage((e.target?.result as string) || null);
    reader.readAsDataURL(file);
    setProfileImage(file);
  };

  // 최초 로드: 내 정보 불러오기
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const me: VetMyResponse = await getVetMy();

        setVetName(me.name ?? '');
        setLicense(me.license ?? '');
        setProfile(me.profile ?? '');

        // 프로필 이미지 설정: null이면 기본 이미지, 있으면 IMAGE_URL + 경로
        if (me.photo && photoUrl) {
          setPhotoSrc(`${photoUrl}${me.photo}`);
        } else {
          setPhotoSrc(DEFAULT_PHOTO);
        }
      } catch (e) {
        console.error(e);
        setError('수의사 정보를 불러오지 못했어요!');
        setPhotoSrc(DEFAULT_PHOTO);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSubmit = async () => {
    try {
      setSaving(true);
      setError(null);

      if (!vetName.trim()) {
        alert('수의사 이름을 입력해주세요!');
        return;
      }
      if (!license.trim()) {
        alert('면허번호가 없습니다! 관리자에게 문의해주세요!');
        return;
      }

      // FormData로 전송 (파일 포함)
      const formData = new FormData();
      const vetRequestData = {
        name: vetName.trim(),
        license: license.trim(),
        profile: profile.trim() || '',
      };
      formData.append('vetUpdateRequest', new Blob([JSON.stringify(vetRequestData)], { type: 'application/json' }));

      if (profileImage) {
        formData.append('photo', profileImage);
      }

      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }
      console.log('formdata', formData);

      // formdata로 api 호출
      const response = await updateVetMy(formData);
      alert('수정이 완료되었습니다.');
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
        <div>
          <label className="block h4 text-black mb-2">프로필 사진</label>
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
          <div className="flex items-center gap-4">
            <div className="w-22 h-22 bg-green-100 border-3 border-green-200 rounded-[12px] flex items-center justify-center overflow-hidden">
              <img
                src={previewImage || photoSrc}
                alt="프로필 사진"
                className="w-full h-full object-cover"
                onError={(e) => {
                  // 네트워크/경로 에러 시 기본 이미지로 폴백
                  (e.currentTarget as HTMLImageElement).src = '';
                }}
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
      </div>

      <br />
      <motion.div
        className="px-7"
        initial={{ opacity: 0, y: 10 }}   // 애니메이션 초기 상태
        animate={{ opacity: 1, y: 0 }}    // 애니메이션 종료 상태
        transition={{ duration: 0.3 }}    // 애니메이션 지속 시간
      >
        <Button
          text={saving ? '수정 중…' : '수정하기'}
          onClick={handleSubmit}
          color="green"
        />
      </motion.div>

      <motion.div
        className="flex justify-center gap-2 mt-2 px-7"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}  // 살짝 늦게 등장
      >
        <motion.button
          className="h4 text-center text-gray-500 cursor-pointer"
          onClick={handleLogout}
          whileHover={{ scale: 1.05 }}               // hover 효과
          transition={{ duration: 0.2 }}
        >
          로그 아웃
        </motion.button>
      </motion.div>
    </>
  );
}
