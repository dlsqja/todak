import React, { useEffect, useState } from 'react';
import '@/styles/main.css';
import SimpleHeader from '@/component/header/SimpleHeader';
import Input from '@/component/input/Input';
import Button from '@/component/button/Button';
import { useNavigate } from 'react-router-dom';

import { getVetMy, updateVetMy } from '@/services/api/Vet/vetmypage';
import type { VetMyResponse } from '@/types/Vet/vetmypageType';

export default function VetMypage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [license, setLicense] = useState('');
  const [vetName, setVetName] = useState('');
  const [profile, setProfile] = useState('');

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

    await updateVetMy({
      name: vetName.trim(),
      license: license.trim(),   // ← ★ 여기 반드시 포함 ★
      profile: profile.trim(),
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
        <Input id="license" label="면허번호" value={license} disabled />
        <Input
          id="name"
          label="수의사 이름"
          value={vetName}
          onChange={(e) => setVetName(e.target.value)}
          disabled={loading}
        />
        <div className="flex flex-col">
          <label htmlFor="profile" className="mb-2 block h4 text-black">수의사 소개글</label>
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
      <div className="px-7">
        <Button text={saving ? '수정 중…' : '수정하기'} onClick={handleSubmit} color="green" />
      </div>
      <div className="flex justify-center gap-2 mt-2">
        <button className="h4 text-center text-gray-500 cursor-pointer">로그 아웃</button>
        <span className="text-gray-500"> | </span>
        <button className="h4 text-center text-gray-500 cursor-pointer">회원 탈퇴</button>
      </div>
    </>
  );
}
