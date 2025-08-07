import MobileAuthLayout from '@/layouts/MobileAuthLayout';
import SignupPage from '@/component/pages/auth/Signup';
import OwnerSignup from '@/component/pages/auth/OwnerSignup';
import VetSignup from '@/component/pages/auth/VetSignup';
import StaffSignup from '@/component/pages/auth/StaffSignup';

const authRoutes = {
  path: '/auth',
  element: <MobileAuthLayout />,
  children: [
    { path: '', element: <SignupPage /> },
    { path: 'owner/:authId', element: <OwnerSignup /> },
    { path: 'vet', element: <VetSignup /> },
    { path: 'staff', element: <StaffSignup /> },
  ],
};

export default authRoutes;
