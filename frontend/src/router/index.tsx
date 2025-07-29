// 절대경로 @는 vite.config.ts + tsconfig.json 기반
import HomePage from '@/pages/HomePage'; 
import MyPage from '@/pages/Mypage'; // 마이페이지 컴포넌트
import { createBrowserRouter } from 'react-router';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />

  },
  {
    path: '/mypage',
    element: <MyPage />

  },
  ])

export default router;