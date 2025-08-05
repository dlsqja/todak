import StaffHome from '@/component/pages/Staff/StaffHome';
import MobileLayout from '@/layouts/MobileLayout';
import StaffHospital from '@/component/pages/Staff/StaffHospital';
import StaffReservationManagement from '@/component/pages/Staff/StaffReservationManagement';
import StaffVetManagement from '@/component/pages/Staff/StaffVetManagement';
import StaffMypage from '@/component/pages/Staff/StaffMypage';
import StaffMenuBar from '@/component/menubar/StaffMenuBar';

const staffRoutes = {
  path: '/staff',
  element: <MobileLayout menuBar={<StaffMenuBar />} />,
  children: [
    { path: 'home', element: <StaffHome /> },
    { path: 'hospital', element: <StaffHospital /> },
    { path: 'reservationManagement', element: <StaffReservationManagement /> },
    { path: 'vetManagement', element: <StaffVetManagement /> },
    { path: 'mypage', element: <StaffMypage /> },
  ],
};

export default staffRoutes;
