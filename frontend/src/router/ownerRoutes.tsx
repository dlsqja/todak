import MobileLayout from '@/layouts/MobileLayout';
import OwnerMenuBar from '@/component/menubar/OwnerMenuBar';
import OwnerHome from '@/component/pages/Owner/Home/OwnerHome';
import OwnerPet from '@/component/pages/Owner/Pet/OwnerPetHome';
import OwnerMyPage from '@/component/pages/Owner/Mypage/OwnerMyPage';
import OwnerReservationHome from '@/component/pages/Owner/Reservation/OwnerReservationHome';
import OwnerTreatment from '@/component/pages/Owner/Treatment/OwnerTreatment';
import SelectHospitalPage from '@/component/pages/Owner/Home/OwnerHomeSelectHospital';
import SelectVetPage from '@/component/pages/Owner/Home/OwnerHomeSelectVet';
import VetInfoPage from '@/component/pages/Owner/Home/OwnerHomeVetInfo';
import ApplyFormPage from '@/component/pages/Owner/Home/OwnerHomeApplyForm';
import OwnerPetEdit from '@/component/pages/Owner/Pet/OwnerPetEdit';
import OwnerPetRegister from '@/component/pages/Owner/Pet/OwnerPetRegister';
import OwnerReservationDetail from '@/component/pages/Owner/Reservation/OwnerReservationDetail';
import OwnerTreatmentDetail from '@/component/pages/Owner/Treatment/OwnerTreatmentDetail';
import PaymentMethodPage from '@/component/pages/Owner/Home/OwnerHomePaymentMethod';
import ApplyCompletePage from '@/component/pages/Owner/Home/OwnerHomeApplyComplete';
import OwnerTreatmentRTC from '@/component/pages/Owner/Treatment/OwnerTreatmentRTC';
import OwnerHomeGuide from '@/component/pages/Owner/Home/OwnerHomeGuide';
import TreatmentDetailPage from '@/component/pages/Owner/Pet/OwnerPetTabRecordDetail';

const ownerRoutes = {
  path: '/owner',
  element: <MobileLayout menuBar={<OwnerMenuBar />} />,
  children: [
    { path: 'home', element: <OwnerHome /> },
    { path: 'home/guide', element: <OwnerHomeGuide /> },
    { path: 'home/hospital', element: <SelectHospitalPage /> },
    { path: 'home/vet', element: <SelectVetPage /> },
    { path: 'home/vet-info', element: <VetInfoPage /> },
    { path: 'home/form', element: <ApplyFormPage /> },
    { path: 'home/payment', element: <PaymentMethodPage /> },
    { path: 'home/apply-complete', element: <ApplyCompletePage /> },
    { path: 'pet', element: <OwnerPet /> },
    { path: 'pet/register', element: <OwnerPetRegister /> },
    { path: 'pet/edit/:id', element: <OwnerPetEdit /> },
    { path: 'pet/treatment/detail/:id', element: <OwnerTreatmentDetail /> },
    { path: 'reservation', element: <OwnerReservationHome /> },
    { path: 'reservation/:id', element: <OwnerReservationDetail /> },
    { path: 'mypage', element: <OwnerMyPage /> },
    { path: 'treatment', element: <OwnerTreatment /> },
    { path: 'treatment/rtc/:id', element: <OwnerTreatmentRTC /> },
  ],
};

export default ownerRoutes;
