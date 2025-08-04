import React from 'react';
import { Outlet } from 'react-router-dom';

interface MobileLayoutProps {
  menuBar?: React.ReactNode;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({ menuBar }) => (
  <div className="h-screen mx-auto max-w-md bg-green-100 relative flex flex-col items-center">
    <main>
      <Outlet />
    </main>
    {menuBar}
  </div>
);
export default MobileLayout;
