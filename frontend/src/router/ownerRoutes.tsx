import MobileLayout from '@/layouts/MobileLayout';
import OwnerMenuBar from '@/component/menubar/OwnerMenuBar';
import OwnerHome from '@/component/pages/Owner/OwnerHome';
import OwnerPet from '@/component/pages/Owner/Pet/OwnerPetHome';
import OwnerMyPage from '@/component/pages/Owner/OwnerMyPage';
import OwnerReservationHome from '@/component/pages/Owner/Reservation/OwnerReservationHome';
import OwnerTreatment from '@/component/pages/Owner/OwnerTreatment';
import OwnerPetEdit from '@/component/pages/Owner/Pet/OwnerPetEdit';
import OwnerPetRegister from '@/component/pages/Owner/Pet/OwnerPetRegister';
import OwnerReservationDetail from '@/component/pages/Owner/Reservation/OwnerReservationDetail';

const ownerRoutes = {
  path: '/owner',
  element: <MobileLayout menuBar={<OwnerMenuBar />} />,
  children: [
    { path: 'home', element: <OwnerHome /> },
    { path: 'pet', element: <OwnerPet /> },
    { path: 'pet/register', element: <OwnerPetRegister /> },
    { path: 'pet/edit/:id', element: <OwnerPetEdit /> },
    { path: 'reservation', element: <OwnerReservationHome /> },
    { path: 'reservation/:id', element: <OwnerReservationDetail /> },
    { path: 'treatment', element: <OwnerTreatment /> },
    { path: 'mypage', element: <OwnerMyPage /> },
  ],
};

export default ownerRoutes;
