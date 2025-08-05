import MobileLayout from '@/layouts/MobileLayout';
import OwnerMenuBar from '@/component/menubar/OwnerMenuBar';
import OwnerHome from '@/component/pages/Owner/OwnerHome';
import OwnerPet from '@/component/pages/Owner/Pet/OwnerPetHome';
import OwnerMyPage from '@/component/pages/Owner/OwnerMyPage';
import OwnerReservation from '@/component/pages/Owner/Reservation/OwnerReservationHome';
import OwnerTreatment from '@/component/pages/Owner/OwnerTreatment';
import RegisterPet from '@/component/pages/Owner/Pet/RegisterPet';
import SelectHospitalPage from '@/component/pages/Owner/Home/OwnerHomeSelectHospital';
import SelectVetPage from '@/component/pages/Owner/Home/OwnerHomeSelectVet';
import VetInfoPage from '@/component/pages/Owner/Home/OwnerHomeVetInfo'
import ApplyFormPage from '@/component/pages/Owner/Home/OwnerHomeApplyForm';
import OwnerPetEdit from '@/component/pages/Owner/Pet/OwnerPetEdit';
import OwnerPetRegister from '@/component/pages/Owner/Pet/OwnerPetRegister';

const ownerRoutes = {
  path: '/owner',
  element: <MobileLayout menuBar={<OwnerMenuBar />} />,
  children: [
    { path: 'home', element: <OwnerHome />},
    { path: 'home/hospital', element: <SelectHospitalPage />},
    { path: 'home/vet', element: <SelectVetPage />},
    { path: 'home/vet-info', element: <VetInfoPage />},
    { path: 'home/form', element: <ApplyFormPage />},
    { path: 'pet', element: <OwnerPet /> },
    { path: 'pet/register', element: <OwnerPetRegister /> },
    { path: 'pet/edit/:id', element: <OwnerPetEdit /> },
    { path: 'reservation', element: <OwnerReservation /> },
    { path: 'treatment', element: <OwnerTreatment /> },
    { path: 'mypage', element: <OwnerMyPage /> },
  ],
};

export default ownerRoutes;
