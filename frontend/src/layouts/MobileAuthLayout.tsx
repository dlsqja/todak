import React from 'react';
import { Outlet } from 'react-router-dom';

const MobileAuthLayout = () => (
  <div className="max-h-screen w-full mx-auto max-w-md bg-green-100 flex flex-col pt-7">
    <main className="h-screen overflow-y-auto pb-2">
      <Outlet />
    </main>
  </div>
);
export default MobileAuthLayout;
