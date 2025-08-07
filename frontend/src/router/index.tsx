import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import ownerRoutes from '@/router/ownerRoutes';
import vetRoutes from '@/router/vetRoutes';
import staffRoutes from '@/router/staffRoutes';
import authRoutes from '@/router/authRoutes';
import MobileLayout from '@/layouts/MobileLayout';
import MainPage from '@/component/pages/MainPage';
import MainLayout from '@/layouts/MainLayout';

// 역할 분기
function RoleRedirect() {
  const role = localStorage.getItem('role');
  if (role === 'owner') window.location.replace('/owner/home');
  else if (role === 'vet') window.location.replace('/vet/home');
  else if (role === 'staff') window.location.replace('/staff/home');
  else window.location.replace('/');
  return null;
}

const mainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [{ path: '', element: <MainPage /> }],
};

const router = createBrowserRouter([mainRoutes, authRoutes, ownerRoutes, vetRoutes, staffRoutes]);

export default router;
