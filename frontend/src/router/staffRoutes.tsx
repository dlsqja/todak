import StaffHome from '@/component/pages/Staff/StaffHome';
import StaffHospitalHome from '@/component/pages/Staff/StaffHospital/StaffHospitalHome';
import StaffReservation from '@/component/pages/Staff/StaffReservation';
import StaffPayment from '@/component/pages/Staff/StaffPayment';
import StaffMypage from '@/component/pages/Staff/StaffMypage';

import StaffHospitalInfo from '@/component/pages/Staff/StaffHospital/StaffHospitalInfo';
import StaffHospitalVet from '@/component/pages/Staff/StaffHospital/StaffHospitalVet';

import MobileLayout from '@/layouts/MobileLayout';
import StaffMenuBar from '@/component/menubar/StaffMenuBar';

const staffRoutes = {
  path: '/staff',
  element: <MobileLayout menuBar={<StaffMenuBar />} />,
  children: [
    { path: 'home', element: <StaffHome /> },
    { path: 'hospital', element: <StaffHospitalHome /> },
    { path: 'hospital/info', element: <StaffHospitalInfo />},
    { paht: 'hospital/vet', element: <StaffHospitalVet />},
    { path: 'reservation', element: <StaffReservation /> },
    { path: 'payment', element: <StaffPayment /> },
    { path: 'mypage', element: <StaffMypage /> },
  ],
};

export default staffRoutes;
