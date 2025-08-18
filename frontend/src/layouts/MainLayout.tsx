import React from 'react';
import { Outlet } from 'react-router-dom';

const MainLayout = () => (
  <div className="max-h-screen bg-gray-100 flex justify-center items-start">
    <div className="w-full mx-auto max-w-md bg-green-200 flex flex-col shadow-lg">
      <main className="h-screen pb-2 hide-scrollbar">
        <Outlet />
      </main>
    </div>
  </div>
);
export default MainLayout;
