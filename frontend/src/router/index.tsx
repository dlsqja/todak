import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import MainPage from '@/component/pages/MainPage';
import OwnerHome from '@/component/pages/Owner/OwnerHome';
import VetHome from '@/component/pages/Vet/VetHome';
import StaffHome from '@/component/pages/Staff/StaffHome';
import OwnerAnimal from '@/component/pages/Owner/OwnerAnimal';
import OwnerReservation from '@/component/pages/Owner/OwnerReservation';
import OwnerTreatment from '@/component/pages/Owner/OwnerTreatment';
import OwnerMyPage from '@/component/pages/Owner/OwnerMyPage';

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
  { path: '/', element: <MainPage /> },
  { path: '/role-redirect', element: <RoleRedirect /> },
  {
    path: '/owner/home',
    element: <OwnerHome />,
    children: [
      { path: 'animal', element: <OwnerAnimal /> },
      { path: 'mypage', element: <OwnerMyPage /> },
      { path: 'reservation', element: <OwnerReservation /> },
      { path: 'treatemnet', element: <OwnerTreatment /> },

    ],
  },
  { path: '/vet/home', element: <VetHome /> },
  { path: '/staff/home', element: <StaffHome /> },
]);

export default router;