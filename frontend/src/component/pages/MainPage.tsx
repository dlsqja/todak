import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import KakaoLogin from '@/component/icon/kakao_login.png';

function HomePage() {
  const [selected, setSelected] = useState(0);
  const navList = ['반려인', '수의사', '병원 관계자']; // 0 : 반려인, 1 : 수의사, 2 : 병원 관계자
  const navigate = useNavigate();

  const roleToPath = {
    0: '/owner/home',
    1: '/vet/home',
    2: '/staff/home',
  };

  // 카카오 로그인 후 이동
  const handleKakaoLogin = () => {
    // 실제 카카오 로그인 API를 연동한다면,
    // 로그인 성공 콜백에서 navigate(roleToPath[selected])를 호출
    navigate(roleToPath[selected as keyof typeof roleToPath]);
  };

  return (
    <div>
      <div className="flex flex-col items-center justify-center">
        <h3 className="h3">화면 하단에서 본인의 역할을</h3>
        <h3 className="h3">선택하여 이용해주세요</h3>
      </div>
      <nav className="px-5 w-full flex justify-center gap-12 mt-11 border-b-2 border-gray-100">
        {navList.map((label, idx) => (
          <span
            key={label}
            className={`pb-2 h4 cursor-pointer border-b-2 ${
              selected === idx ? 'text-black border-gray-black' : 'text-gray-600 border-transparent'
            }`}
            onClick={() => {
              setSelected(idx);
              console.log('로그인하고자 하는 역할:', label);
            }}
          >
            {label}
          </span>
        ))}
      </nav>

      <br />

      {/* 카카오 로그인 버튼 */}
      <div className="flex justify-center">
        <img src={KakaoLogin} alt="kakao_login" className="object-center cursor-pointer" onClick={handleKakaoLogin} />
      </div>
    </div>
  );
}

export default HomePage;
