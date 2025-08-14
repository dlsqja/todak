import React from 'react';
import { Outlet } from 'react-router-dom';

const MobileAuthLayout = () => (
  <div className="max-h-screen mx-auto max-w-md bg-gray-50 flex flex-col pt-7">
    <main className="h-screen pb-2">
      <Outlet />
    </main>
  </div>
);
export default MobileAuthLayout;
