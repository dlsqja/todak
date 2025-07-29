import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import HomePage from '@/pages/HomePage';
import OwnerHome from '@/pages/Owner/OwnerHome';
import VetHome from '@/pages/Vet/VetHome';
import StaffHome from '@/pages/Staff/StaffHome';

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
  { path: '/', element: <HomePage /> },
  { path: '/role-redirect', element: <RoleRedirect /> },
  { path: '/owner/home', element: <OwnerHome /> },
  { path: '/vet/home', element: <VetHome /> },
  { path: '/staff/home', element: <StaffHome /> },
]);

export default router;