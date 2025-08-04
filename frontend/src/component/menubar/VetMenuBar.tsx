import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import VetHospitalIcon from '@/component/icon/HospitalIcon';
import VetMyPageIcon from '@/component/icon/MyPageIcon';
import VetRecordIcon from '@/component/icon/RecordIcon';
import VetTreatmentIcon from '@/component/icon/TreatmentIcon';
import VetHomeIcon from '@/component/icon/HomeIcon';

const menuList = [
  { name: '홈', icon: VetHomeIcon, path: '/vet/home' },
  { name: '병원 관리', icon: VetHospitalIcon, path: '/vet/hospital' },
  { name: '비대면 진료', icon: VetTreatmentIcon, path: '/vet/treatment' },
  { name: '진료 기록', icon: VetRecordIcon, path: '/vet/records' },
  { name: '마이', icon: VetMyPageIcon, path: '/vet/mypage' },
];

const VetMenuBar: React.FC = () => {
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
      className="fixed w-md bottom-0 left-1/2 -translate-x-1/2 
    flex flex-row items-center justify-center
    rounded-t-4xl 
    bg-green-100 py-0.5 px-5 gap-7 menu-bar"
    >
      {menuList.map((menu, index) => {
        const Icon = menu.icon;
        // 현재 경로와 메뉴 path가 일치하면 isActive
        const isActive = location.pathname === menu.path;
        return (
          <button
            key={index}
            className={`flex flex-col items-center cursor-pointer
            ${isActive ? 'text-black fill-black' : 'fill-gray-500 text-gray-500'}`}
            onClick={() => handleClick(menu.path)}
            type="button"
          >
            <Icon />
            <span className="caption-bold">{menu.name}</span>
          </button>
        );
      })}
    </div>
  );
};

export default VetMenuBar;
