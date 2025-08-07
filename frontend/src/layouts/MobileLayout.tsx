import React from 'react';
import { Outlet } from 'react-router-dom';

interface MobileLayoutProps {
  menuBar?: React.ReactNode;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({ menuBar }) => (
  <div className="max-h-screen w-full mx-auto max-w-md bg-green-100 flex flex-col pt-7">
    <main className="h-screen overflow-y-auto pb-2">
      {/* hidden scrollbar  설정가능*/}
      <Outlet />
    </main>
    {menuBar}
  </div>
);
export default MobileLayout;
