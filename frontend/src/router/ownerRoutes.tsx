import MobileLayout from '@/layouts/MobileLayout';
import OwnerMenuBar from '@/component/menubar/OwnerMenuBar';
import OwnerHome from '@/component/pages/Owner/OwnerHome';
import OwnerAnimal from '@/component/pages/Owner/OwnerAnimal';
import OwnerMyPage from '@/component/pages/Owner/OwnerMyPage';
import OwnerReservation from '@/component/pages/Owner/Reservation/OwnerReservationHome';
import OwnerTreatment from '@/component/pages/Owner/OwnerTreatment';

const ownerRoutes = {
  path: '/owner',
  element: <MobileLayout menuBar={<OwnerMenuBar />} />,
  children: [
    { path: 'home', element: <OwnerHome /> },
    { path: 'animal', element: <OwnerAnimal /> },
    { path: 'reservation', element: <OwnerReservation /> },
    { path: 'treatment', element: <OwnerTreatment /> },
    { path: 'mypage', element: <OwnerMyPage /> },
  ],
};

export default ownerRoutes;
