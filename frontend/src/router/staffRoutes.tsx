import StaffHome from '@/component/pages/Staff/StaffHome';
import StaffHospital from '@/component/pages/Staff/StaffHospital';
import StaffReservation from '@/component/pages/Staff/StaffReservation';
import StaffPayment from '@/component/pages/Staff/StaffPayment';
import StaffMypage from '@/component/pages/Staff/StaffMypage';

import MobileLayout from '@/layouts/MobileLayout';
import StaffMenuBar from '@/component/menubar/StaffMenuBar';

const staffRoutes = {
  path: '/staff',
  element: <MobileLayout menuBar={<StaffMenuBar />} />,
  children: [
    { path: 'home', element: <StaffHome /> },
    { path: 'hospital', element: <StaffHospital /> },
    { path: 'reservation', element: <StaffReservation /> },
    { path: 'payment', element: <StaffPayment /> },
    { path: 'mypage', element: <StaffMypage /> },
  ],
};

export default staffRoutes;
