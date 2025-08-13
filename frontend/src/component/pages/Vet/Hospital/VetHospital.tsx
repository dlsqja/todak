import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '@/styles/main.css';
import Input from '@/component/input/Input';
import Button from '@/component/button/Button';
import SimpleHeader from '@/component/header/SimpleHeader';

import { getHospitalMine, updateHospitalMine } from '@/services/api/Vet/vethospital';
import type { HospitalDetail } from '@/types/Vet/vethospitalType';

export default function VetHospital() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 표시 전용(수정 불가)
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [contact, setContact] = useState('');

  // 수정 가능
  const [profile, setProfile] = useState('');

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const h: HospitalDetail = await getHospitalMine();
        setName(h?.name ?? '');
        setAddress(h?.location ?? '');
        setContact(h?.contact ?? '');
        setProfile(h?.profile ?? '');
      } catch (e) {
        console.error(e);
        // 403 포함 모든 실패를 사용자 친화적으로 처리
        setError('병원 정보를 불러오지 못했어요. 잠시 후 다시 시도해주세요.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSubmit = async () => {
  try {
    setSaving(true);
    setError(null);

    await updateHospitalMine({
      name,                 // 기존 값
      location: address,    // 백엔드 키는 location (UI 라벨은 "위치")
      contact,              // 기존 값
      profile,              // 수정한 값
    });

    alert('수정 완료!');
    navigate('/vet/hospital');
  } catch (e) {
    console.error(e);
    setError('수정에 실패했어요. 잠시 후 다시 시도해주세요.');
  } finally {
    setSaving(false);
  }
};

  return (
    <>
      <SimpleHeader text="병원 정보" />
      <div className="flex flex-col gap-6 px-7 mt-11">
        {/* 병원코드: API에 없으므로 고정 ‘—’로 표기 */}

        <Input id="name" label="병원 이름" value={name} disabled />        <Input id="address" label="위치" value={address} disabled />
        <Input id="contact" label="전화번호" value={contact} disabled />

        <div className="flex flex-col">
          <label htmlFor="profile" className="mb-2 block h4 text-black">
            병원 소개글
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
      <div className="px-7">
        <Button text={saving ? '수정 중…' : '수정하기'} onClick={handleSubmit} color="green" />
      </div>
    </>
  );
}
