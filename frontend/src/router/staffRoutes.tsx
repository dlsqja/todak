import StaffHome from '@/component/pages/Staff/Home/StaffHome';
import StaffHospitalHome from '@/component/pages/Staff/StaffHospital/StaffHospitalHome';
import StaffReservation from '@/component/pages/Staff/Reservation/StaffReservationMain';
import StaffReservationDetail from '@/component/pages/Staff/Reservation/StaffReservationDetail';
import StaffPayment from '@/component/pages/Staff/Payment/StaffPayment';
import StaffMypage from '@/component/pages/Staff/Mypage/StaffMypage';
import StaffHomeGuide from '@/component/pages/Staff/Home/StaffHomeGuide';
import StaffPaymentDetail from '@/component/pages/Staff/Payment/StaffPaymentDetail';

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
    { path: 'reservation', element: <StaffReservation /> },
    { path: 'payment', element: <StaffPayment /> },
    { path: 'payment/:paymentId', element: <StaffPaymentDetail /> },
    { path: 'mypage', element: <StaffMypage /> },
  ],
};

const staffRoutesWithoutMenu = {
  path: '/staff',
  element: <MobileLayout />,
  children: [
    { path: 'home/guide', element: <StaffHomeGuide /> },
    { path: 'hospital/info', element: <StaffHospitalInfo /> },
    { path: 'hospital/vet', element: <StaffHospitalVet /> },
    { path: 'reservation/detail', element: <StaffReservationDetail /> },
  ],
};

export default { staffRoutes, staffRoutesWithoutMenu };
