import React from 'react';
import { Outlet } from 'react-router-dom';

interface MobileAuthLayoutProps {
  children?: React.ReactNode;
}

const MobileAuthLayout: React.FC<MobileAuthLayoutProps> = ({ children }) => (
  <div className="min-h-[956px] mx-auto max-w-md bg-green-100 relative">
    <main>{children}</main>
  </div>
);
export default MobileAuthLayout;
