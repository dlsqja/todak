import React, { Children } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import ownerRoutes from '@/router/ownerRoutes';
import vetRoutes from '@/router/vetRoutes';
import staffRoutes from '@/router/staffRoutes';
import authRoutes from '@/router/authRoutes';
import MobileLayout from '@/layouts/MobileLayout';
import MainPage from '@/component/pages/MainPage';
import MainLayout from '@/layouts/MainLayout';
import HomeGuidePage from '@/component/pages/Owner/Home/OwnerHomeGuide';
import path from 'path';
import VideoCall from '@/RTC/VideoCall';

const mainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [{ path: '', element: <MainPage /> }],
};

const homeGuideRoutes = {
  path: '/home/guide',
  element: <MobileLayout />,
  children: [{ path: '', element: <HomeGuidePage /> }],
};

const rtcRoutes = {
  path: '/rtc',
  element: <MobileLayout />,
  children: [{ path: '', element: <VideoCall /> }],
};

const router = createBrowserRouter([
  mainRoutes,
  authRoutes,
  homeGuideRoutes,
  rtcRoutes,
  ownerRoutes.ownerRoutes,
  ownerRoutes.ownerRoutesWithoutMenu,
  vetRoutes.vetRoutes,
  vetRoutes.vetRoutesWithoutMenu,
  staffRoutes.staffRoutes,
  staffRoutes.staffRoutesWithoutMenu,
]);

export default router;
