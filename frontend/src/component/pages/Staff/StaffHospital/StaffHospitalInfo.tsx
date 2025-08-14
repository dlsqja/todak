import React, { useEffect, useMemo, useState } from 'react';
import '@/styles/main.css';

import BackHeader from '@/component/header/BackHeader';
import Input from '@/component/input/Input';
import SearchInput from '@/component/input/SearchInput';
import Button from '@/component/button/Button';

import { getStaffHospitalDetail, updateStaffHospital } from '@/services/api/Staff/staffhospital';

export default function StaffHospitalInfo() {
  const [hospitalName, setHospitalName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [phone, setPhone] = useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getStaffHospitalDetail();
        if (!alive) return;
        setHospitalName(data.name ?? '');
        setDescription(data.profile ?? '');
        setLocation(data.location ?? '');
        setPhone(data.contact ?? '');
      } catch (e: any) {
        if (!alive) return;
        setError(e?.message || '병원 정보를 불러오지 못했어요!');
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const canSave = useMemo(() => !loading && !saving, [loading, saving]);

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      await updateStaffHospital({
        name: hospitalName.trim(),
        profile: description.trim(),
        location: location.trim(),
        contact: phone.trim(),
      });
      alert('수정이 완료되었습니다.');
    } catch (e: any) {
      setError(e?.message || '수정 중 오류가 발생했어요!');
      alert('수정에 실패했습니다. 잠시후 다시 시도해주세요.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <BackHeader text="병원 정보 관리" />
      <div className="px-5 pb-24 pt-4 space-y-6">
        {error && <div className="text-red-600">{error}</div>}

        {loading ? (
          <>
            <div className="h-12 rounded-2xl bg-gray-100 animate-pulse" />
            <div className="h-24 rounded-2xl bg-gray-100 animate-pulse" />
            <div className="h-12 rounded-2xl bg-gray-100 animate-pulse" />
            <div className="h-12 rounded-2xl bg-gray-100 animate-pulse" />
          </>
        ) : (
          <>
            {/* ✅ 병원코드/사업자번호 제거!!!! */}
            <Input
              id="hospitalName"
              label="병원 이름"
              value={hospitalName}
              onChange={(e) => setHospitalName(e.target.value)}
            />

            <Input
              id="description"
              label="병원 소개글"
              placeholder="병원 소개글을 입력해주세요"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <Input
              id="location"
              label="병원 위치"
              placeholder="예) 강남구 역삼동 123-45 (혹은 건물명)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />

            <Input
              id="phone"
              label="병원 전화번호"
              placeholder="02-1234-5678"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <div className="pt-4">
              <Button color="green" text={saving ? '수정 중...' : '수정하기'} onClick={handleSave} />
            </div>
          </>
        )}
      </div>
    </>
  );
}
