import React from 'react';
import { Outlet } from 'react-router-dom';

const MobileAuthLayout = () => (
  <div className="max-h-screen bg-gray-100 flex justify-center items-start">
    <div className="w-full mx-auto max-w-md bg-gray-50 flex flex-col pt-7 shadow-lg">
      <main className="h-screen overflow-y-auto pb-2 hide-scrollbar">
        <Outlet />
      </main>
    </div>
  </div>
);
export default MobileAuthLayout;
