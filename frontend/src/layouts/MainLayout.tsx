import React from 'react';
import { Outlet } from 'react-router-dom';

const MainLayout = () => (
  <div className="max-h-screen w-full mx-auto max-w-md bg-green-200 flex flex-col pt-7">
    <main className="h-screen overflow-y-auto pb-2">
      <Outlet />
    </main>
  </div>
);
export default MainLayout;
