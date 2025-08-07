import React, { useState } from 'react';
import '@/styles/main.css';
import SimpleHeader from '@/component/header/SimpleHeader';
import Input from '@/component/input/Input';
import Button from '@/component/button/Button';
import { useNavigate } from 'react-router-dom';

export default function StaffMypage() {
  const navigate = useNavigate();
  const [vetName, setVetName] = useState('테스트 이름');

  // // 페이지 로딩 시 기존 데이터 불러오기
  // useEffect(() => {
  //   // API에서 기존 수의사 정보 가져오기
  //   const fetchVetInfo = async () => {
  //     const response = await axios.get('/vet/info');
  //     setProfile(response.data.profile || ''); // 기존 소개글
  //     setVetName(response.data.name || ''); // 기존 수의사 이름
  //   };
  //   fetchVetInfo();
  // }, []);

  const vetInfo = {
    hospital_Code: 'A409',
    vet_name: '김싸피',
    license_number: '123-456-789',
    profile: '수의사 소개글입니다',
  };

  const handleSubmit = () => {
    console.log('제출할 이름:', vetName);
    alert(`수정 완료`);
    navigate('/vet/home');
  };

  return (
    <>
      <SimpleHeader text="마이페이지" />
      <div className="flex flex-col gap-6 px-7 mt-6">
        <Input id="hospital_Code" label="병원코드" value={vetInfo.hospital_Code} disabled={true} />
        <Input id="name" label="이름" value={vetName} onChange={(e) => setVetName(e.target.value)} disabled={false} />
      </div>
      <br />
      <div className="px-7 mt-44">
        <Button text="수정하기" onClick={handleSubmit} color="green" />
      </div>
      <div className="flex justify-center gap-2 mt-2">
        <button className="h4 text-center text-gray-500 cursor-pointer">로그 아웃</button>
        <span className="text-gray-500"> | </span>
        <button className="h4 text-center text-gray-500 cursor-pointer">회원 탈퇴</button>
      </div>
    </>
  );
}
