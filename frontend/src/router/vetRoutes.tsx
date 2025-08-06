import VetHome from '@/component/pages/Vet/VetHome';
import MobileLayout from '@/layouts/MobileLayout';
import VetMenuBar from '@/component/menubar/VetMenuBar';
import VetHospital from '@/component/pages/Vet/VetHospital';
import VetTreatment from '@/component/pages/Vet/Treatment/VetTreatment';
import VetRecord from '@/component/pages/Vet/Record/VetRecord';
import VetRecordDetail from '@/component/pages/Vet/Record/VetRecorddetail';
import VetMyPage from '@/component/pages/Vet/VetMypage';
import VetTreatmentDetail from '@/component/pages/Vet/Treatment/VetTreatmentDetail';
import VetTreatmentRTC from '@/component/pages/Vet/Treatment/VetTreatmentRTC';

const vetRoutes = {
  path: '/vet',
  element: <MobileLayout menuBar={<VetMenuBar />} />,
  children: [
    { path: 'home', element: <VetHome /> },
    { path: 'hospital', element: <VetHospital /> },
    { path: 'treatment', element: <VetTreatment /> },
    { path: 'treatment/detail/:reservationId', element: <VetTreatmentDetail /> },
    { path: 'treatment/rtc/:reservationId', element: <VetTreatmentRTC /> },
    { path: 'records', element: <VetRecord /> },
    { path: 'records/detail/:treatmentId', element: <VetRecordDetail /> },
    { path: 'mypage', element: <VetMyPage /> },
  ],
};

export default vetRoutes;
