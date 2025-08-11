import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import MainPage from '@/component/pages/MainPage';
import ownerRoutes from '@/router/ownerRoutes';
import vetRoutes from '@/router/vetRoutes';
import staffRoutes from '@/router/staffRoutes';
import MobileAuthLayout from '@/layouts/MobileAuthLayout';
import VideoCall from '@/RTC/VideoCall';
import VideoCallSTT from '@/RTC/VideoCallSTT';

// 역할 분기
function RoleRedirect() {
  const role = localStorage.getItem('role');
  if (role === 'owner') window.location.replace('/owner/home');
  else if (role === 'vet') window.location.replace('/vet/home');
  else if (role === 'staff') window.location.replace('/staff/home');
  else window.location.replace('/');
  return null;
}

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <MobileAuthLayout>
        <MainPage />
      </MobileAuthLayout>
    ),
  },
  {
    path: '/rtc',
    element: (
      <MobileAuthLayout>
        <VideoCall />
      </MobileAuthLayout>
    ),
  },
  {
    path: '/stt',
    element: <VideoCallSTT />,
  },
  { path: '/role-redirect', element: <RoleRedirect /> },
  ownerRoutes,
  vetRoutes,
  staffRoutes,
]);

export default router;
