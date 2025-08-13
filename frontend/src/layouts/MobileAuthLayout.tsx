import React from 'react';
import { Outlet } from 'react-router-dom';

const MobileAuthLayout = () => (
  <div className="max-h-screen mx-auto max-w-md bg-green-100 flex flex-col">
    <main className="h-screen pb-2">
      <Outlet />
    </main>
  </div>
);
export default MobileAuthLayout;
