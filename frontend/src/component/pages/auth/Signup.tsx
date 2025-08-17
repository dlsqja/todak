import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import KakaoLogin from '@/component/icon/kakao_login.png';
import { authAPI } from '@/services/api/auth';

// 카카오 SDK 타입 선언
declare global {
  interface Window {
    Kakao: any;
  }
}

function SignupPage() {
  const [selected, setSelected] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const navList = ['반려인', '수의사', '병원 관계자']; // 0 : 반려인, 1 : 수의사, 2 : 병원 관계자
  const navigate = useNavigate();

  const roleMapping = {
    반려인: 'owner',
    수의사: 'vet',
    '병원 관계자': 'staff',
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    const token = urlParams.get('token');
    const error = urlParams.get('error');
    const role = urlParams.get('role');
    const authId = urlParams.get('authId');

    // console.log('=== 로그인 결과 디버깅 ===');
    // console.log('success:', success);
    // console.log('token:', token);
    // console.log('error:', error);
    // console.log('role:', role);
    // console.log('authId:', authId);
    // console.log('전체 URL:', window.location.href);

    if (success === 'true' && token) {
      // 토큰 저장
      // authAPI.saveTokens(token);

      // role에 따라 홈으로 이동
      if (role === 'owner') {
        navigate('/owner/home');
      } else if (role === 'vet') {
        navigate('/vet/home');
      } else if (role === 'staff') {
        navigate('/staff/home');
      }
    } else if (error) {
      // 에러에 따라 처리
      if (error === 'not_registered') {
        // authId 파라미터 가져오기
        const authId = urlParams.get('authId');

        if (!authId) {
          alert('인증 정보가 없습니다.');
          return;
        }

        // role에 따라 추가정보 입력창으로 이동 (authId 포함)
        if (role === 'owner') {
          navigate(`/auth/owner/${authId}`);
        } else if (role === 'vet') {
          navigate(`/auth/vet/${authId}`);
        } else if (role === 'staff') {
          navigate(`/auth/staff/${authId}`);
        }
      } else {
        alert('로그인에 실패했습니다.');
      }
    }
  }, [navigate]);

  // 카카오 로그인 후 이동
  const handleKakaoLogin = async () => {
    const kakaoClientId: string = import.meta.env.VITE_KAKAO_API_KEY;
    const baseUrl: string = import.meta.env.VITE_API_BASE_URL;
    const role: string = roleMapping[navList[selected]];

    // 카카오 OAuth URL로 리다이렉트
    const redirectUrl = `${baseUrl}/public/login/${role}`;
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${kakaoClientId}&redirect_uri=${redirectUrl}`;
    window.location.href = kakaoAuthUrl;

    // 백엔드에서 처리 후
    // 성공: http://localhost:5173/owner/home?success=true&token=xxx
    // 실패: http://localhost:5173/owner/signup?error=not_registered
  };

  return (
    <div>
      <div className="flex flex-col items-center justify-center pt-30">
        <h3 className="h3 text-center">로그인을 원하는 역할을</h3>
        <h3 className="h3 text-center">선택해주세요</h3>
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
        <img
          src={KakaoLogin}
          alt="kakao_login"
          className={`object-center cursor-pointer ${isLoading ? 'opacity-50' : ''}`}
          onClick={isLoading ? undefined : handleKakaoLogin}
        />
      </div>
    </div>
  );
}

export default SignupPage;
