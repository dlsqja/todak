import React from 'react';
import { Outlet } from 'react-router-dom';

interface MobileAuthLayoutProps {
  children?: React.ReactNode;
}

const MobileAuthLayout: React.FC<MobileAuthLayoutProps> = ({ children }) => (
  <div className="min-h-[956px] mx-auto max-w-md bg-green-200 relative flex flex-col items-center py-16">
    <main>{children}</main>
  </div>
);
export default MobileAuthLayout;
