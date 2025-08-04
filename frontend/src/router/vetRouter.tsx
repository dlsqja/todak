import VetHome from '@/component/pages/Vet/VetHome';
import MobileLayout from '@/layouts/MobileLayout';
import VetMenuBar from '@/component/menubar/VetMenuBar';
import VetHospital from '@/component/pages/Vet/VetHosptial';
import VetTreatment from '@/component/pages/Vet/VetTreatement';
import VetRecord from '@/component/pages/Vet/VetRecord';
import VetMyPage from '@/component/pages/Vet/VetMypage';

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

export default vetRoutes;
