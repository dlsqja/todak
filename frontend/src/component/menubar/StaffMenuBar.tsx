import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import StaffHospitalIcon from '@/component/icon/HospitalIcon';
import StaffMyPageIcon from '@/component/icon/MyPageIcon';
import StaffReservationManagementIcon from '@/component/icon/ReservationManagementIcon';
import StaffVetManagementIcon from '@/component/icon/VetManagementIcon';
import StaffHomeIcon from '@/component/icon/HomeIcon';

const menuList = [
  { name: '홈', icon: StaffHomeIcon, path: '/staff/home' },
  { name: '병원 관리', icon: StaffHospitalIcon, path: '/staff/hospital' },
  { name: '예약 관리', icon: StaffReservationManagementIcon, path: '/staff/reservation' },
  { name: '결제 관리', icon: StaffVetManagementIcon, path: '/staff/payment' },
  { name: '마이', icon: StaffMyPageIcon, path: '/staff/mypage' },
];

const BottomMenuBar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // 메뉴 클릭 핸들러
  const handleClick = (path: string) => {
    if (location.pathname !== path) {
      navigate(path);
    }
  };

  return (
    <div
    className=" 
    flex flex-row items-center justify-center
    rounded-t-4xl 
    bg-green-100 py-0.5 px-5 gap-4 menu-bar"

    >
      {menuList.map((menu, index) => {
        const Icon = menu.icon;
        // 현재 경로와 메뉴 path가 일치하면 isActive
        const isActive = location.pathname === menu.path;
        return (
          <div
            key={index}
            className={`flex flex-col items-center cursor-pointer h-10 w-15
            ${isActive ? 'text-black fill-black' : 'fill-gray-500 text-gray-500'}`}
            onClick={() => handleClick(menu.path)}
          >
            <Icon width={26} height={26} />
            <span className="caption-bold">{menu.name}</span>
          </div>
        );
      })}
    </div>
  );
};

export default BottomMenuBar;
