import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import ownerRoutes from '@/router/ownerRoutes';
import vetRoutes from '@/router/vetRoutes';
import staffRoutes from '@/router/staffRoutes';
import authRoutes from '@/router/authRoutes';
import MobileLayout from '@/layouts/MobileLayout';
import MainPage from '@/component/pages/MainPage';
import MainLayout from '@/layouts/MainLayout';

const mainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [{ path: '', element: <MainPage /> }],
};

const router = createBrowserRouter([
  mainRoutes,
  authRoutes,
  ownerRoutes.ownerRoutes,
  ownerRoutes.ownerRoutesWithoutMenu,
  vetRoutes.vetRoutes,
  vetRoutes.vetRoutesWithoutMenu,
  staffRoutes.staffRoutes,
  staffRoutes.staffRoutesWithoutMenu,
]);

export default router;
