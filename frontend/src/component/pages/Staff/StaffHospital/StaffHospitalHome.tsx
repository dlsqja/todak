import React from 'react';
import '@/styles/main.css';
import { Link } from 'react-router-dom';
import SimpleHeader from '@/component/header/SimpleHeader';
import { motion } from 'framer-motion'; // framer-motion import 추가

const MENUS = [
  {
    to: '/staff/hospital/info',
    title: '병원 정보 관리',
    desc: '기본 정보, 연락처, 주소, 운영정책 등을 수정합니다.',
  },
  {
    to: '/staff/hospital/vet',
    title: '수의사 근무 시간 관리',
    desc: '수의사별 근무/휴무 시간을 설정하고 관리합니다.',
  },
];

export default function StaffHospitalHome() {
  return (
    <div className="min-h-screen flex flex-col">
      <header>
        <SimpleHeader text="병원 관리" />
      </header>

      <main className="flex-1 px-4 py-8 pb-24 pb-[env(safe-area-inset-bottom)]">
        <nav aria-label="병원 관리 메뉴">
          <ul className="mx-auto max-w-md space-y-4">
            {MENUS.map((item, index) => (
              <motion.li
                key={item.to}
                initial={{ opacity: 0, y: 20 }} // 항목이 위에서 내려오는 애니메이션
                animate={{ opacity: 1, y: 0 }}  // 항목이 자연스럽게 나타남
                exit={{ opacity: 0, y: -20 }}   // 항목이 사라질 때 위로 사라짐
                transition={{
                  duration: 0.3,
                  delay: index * 0.1, // 각 항목마다 등장 순서를 달리하기 위해 지연 적용
                  ease: 'easeOut',
                }}
              >
                <Link
                  to={item.to}
                  className="group block rounded-2xl border border-gray-200
                    bg-white p-4 shadow-sm transition
                    hover:shadow-md hover:border-gray-300
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-400"
                  aria-label={`${item.title} 페이지로 이동`}
                >
                  <div className="flex items-center">
                    <div className="flex-1">
                      <div className="h4">{item.title}</div>
                      <p className="p text-gray-500 mt-1">{item.desc}</p>
                    </div>
                    {/* 우측 화살표 아이콘 */}
                    <svg
                      className="ml-3 h-5 w-5 shrink-0 transition-transform group-hover:translate-x-0.5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </Link>
              </motion.li>
            ))}
          </ul>
        </nav>
      </main>
    </div>
  );
}
