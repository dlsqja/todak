import React from 'react';
import { RouterProvider } from 'react-router-dom';
import router from '@/router';
import MobileLayout from '@/layouts/MobileLayout';

function App() {
  return (
    <MobileLayout>
      <RouterProvider router={router} />
    </MobileLayout>
  );
}

export default App;
