import React, { useState } from 'react';
import ReservationTab from './StaffReservationTab';
import TimeSettingTab from './StaffReservationTimeSettingTab';
import SimpleHeader from '@/component/header/SimpleHeader';

const tabs = [
  { label: '예약 신청 목록', value: 'reservation' },
  { label: '예약 시간 설정', value: 'time' },
];

export default function StaffReservationPage() {
  const [selectedTab, setSelectedTab] = useState('reservation');

  // 🔥 헤더 텍스트도 탭에 따라 다르게!
  const headerText = selectedTab === 'reservation' ? '예약 신청 목록' : '예약 시간 설정';

  return (
    <div className="pb-6">
      {/* ✅ 동적으로 바뀌는 헤더 */}
      <SimpleHeader text={headerText} />

      {/* ✅ 탭 메뉴 */}
      <div className="flex justify-around px-7 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setSelectedTab(tab.value)}
            className={`h-14 w-full rounded-t-2xl font-medium transition-colors duration-200
              ${selectedTab === tab.value
                ? ' text-black border-b-2 border-black'
                : 'text-gray-400'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ✅ 탭 콘텐츠 */}
      <div className="px-7 py-6">
        {selectedTab === 'reservation' ? (
          <ReservationTab />
        ) : (
          <TimeSettingTab />
        )}
      </div>
    </div>
  );
}
