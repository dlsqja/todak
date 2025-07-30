// import React, { useState, useEffect } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { OnwerAnimalIcon, OnwerMyPageIcon, OwnerHomeIcon, OwnerReservationIcon, OwnerTreatmentIcon } from '@/component/common/icons';

// interface Menu {
//   name: string;
//   icon: React.ElementType;
//   path: string;
//   isActive: boolean;
// }

// const menuList: Omit<Menu, 'isActive'>[] = [
//   { name: '예약내역', icon: OnwerAnimalIcon, path: '/owner/home/reservation' },
//   { name: '비대면 진료', icon: OnwerMyPageIcon, path: '/owner/home/treatemnet' },
//   { name: '홈', icon: OwnerHomeIcon, path: '/owner/home/home' },
//   { name: '애완동물', icon: OwnerReservationIcon, path: '/owner/home/animal' },
//   { name: '마이페이지', icon: OwnerTreatmentIcon, path: '/owner/home/mypage' },
// ];

// function getRootPath(path: string) {
//   const root = path.split('/')[1] || '';
//   return root === '' ? 'home' : root;
// }

// const BottomMenuBar: React.FC = () => {
//   const location = useLocation();
//   const navigate = useNavigate();

//   // 메뉴 상태 관리
//   const [menus, setMenus] = useState<Menu[]>(
//     menuList.map(menu => ({
//       ...menu,
//       isActive: false,
//     }))
//   );

//   // 경로 변경 시 active 상태 업데이트
//   useEffect(() => {
//     const currentRoot = getRootPath(location.pathname);
//     setMenus(prevMenus =>
//       prevMenus.map(menu => ({
//         ...menu,
//         isActive: menu.path.replace('/', '') === currentRoot,
//       }))
//     );
//   }, [location.pathname]);

//   // 메뉴 클릭 핸들러
//   const handleClick = (index: number) => {
//     navigate(menus[index].path);
//   };

//   return (
//     <div className="fixed w-md bottom-0 left-1/2 -translate-x-1/2 flex flex-row items-center rounded-t-4xl bg-gray-200 py-0.5 px-5 gap-4 justify-center shadow-menu-bar">
//       {menus.map((menu, index) => {
//         const Icon = menu.icon;
//         return (
//           <button
//             key={index}
//             className={`flex flex-col items-center ${menu.isActive ? 'text-blue-500' : 'text-gray-500'}`}
//             onClick={() => handleClick(index)}
//             type="button"
//           >
//             <Icon />
//             <span className="text-xs">{menu.name}</span>
//           </button>
//         );
//       })}
//     </div>
//   );
// };

// export default BottomMenuBar;