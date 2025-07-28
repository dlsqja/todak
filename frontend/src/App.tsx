import React from 'react';
import { RouterProvider } from 'react-router-dom';
import router from '@/router'; // index 생략 가능

function App() {
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
