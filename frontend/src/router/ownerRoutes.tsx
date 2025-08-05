import MobileLayout from '@/layouts/MobileLayout';
import OwnerMenuBar from '@/component/menubar/OwnerMenuBar';
import OwnerHome from '@/component/pages/Owner/OwnerHome';
import OwnerPet from '@/component/pages/Owner/Pet/OwnerPet';
import OwnerMyPage from '@/component/pages/Owner/OwnerMyPage';
import OwnerReservation from '@/component/pages/Owner/OwnerReservation';
import OwnerTreatment from '@/component/pages/Owner/OwnerTreatment';
import RegisterPet from '@/component/pages/Owner/Pet/RegisterPet';

const ownerRoutes = {
  path: '/owner',
  element: <MobileLayout menuBar={<OwnerMenuBar />} />,
  children: [
    { path: 'home', element: <OwnerHome /> },
    { path: 'pet', element: <OwnerPet /> },
    { path: 'pet/register', element: <RegisterPet /> },
    { path: 'reservation', element: <OwnerReservation /> },
    { path: 'treatment', element: <OwnerTreatment /> },
    { path: 'mypage', element: <OwnerMyPage /> },
  ],
};

export default ownerRoutes;
