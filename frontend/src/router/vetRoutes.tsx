import VetHome from '@/component/pages/Vet/Home/VetHome';
import MobileLayout from '@/layouts/MobileLayout';
import VetMenuBar from '@/component/menubar/VetMenuBar';
import VetHospital from '@/component/pages/Vet/Hospital/VetHospital';
import VetTreatment from '@/component/pages/Vet/Treatment/VetTreatment';
import VetRecord from '@/component/pages/Vet/Record/VetRecordHome';
import VetRecordDetail from '@/component/pages/Vet/Record/VetRecordDetail';
import VetMyPage from '@/component/pages/Vet/Mypage/VetMypage';
import VetTreatmentDetail from '@/component/pages/Vet/Treatment/VetTreatmentDetail';
import VetHomeGuide from '@/component/pages/Vet/Home/VetHomeGuide';
import VetRTC from '@/RTC/VetRTC';

const vetRoutes = {
  path: '/vet',
  element: <MobileLayout menuBar={<VetMenuBar />} />,
  children: [
    { path: 'home', element: <VetHome /> },
    { path: 'hospital', element: <VetHospital /> },
    { path: 'treatment', element: <VetTreatment /> },
    { path: 'records', element: <VetRecord /> },
    { path: 'mypage', element: <VetMyPage /> },
  ],
};
const vetRoutesWithoutMenu = {
  path: '/vet',
  element: <MobileLayout />,
  children: [
    { path: 'home/guide', element: <VetHomeGuide /> },

    { path: 'treatment/detail/:reservationId', element: <VetTreatmentDetail /> },
    { path: 'treatment/rtc/', element: <VetRTC /> },
    { path: 'records/detail/:treatmentId', element: <VetRecordDetail /> },
  ],
};

export default { vetRoutes, vetRoutesWithoutMenu };
