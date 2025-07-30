import React from 'react';

interface MobileLayoutProps {
  children: React.ReactNode;
}

export default function MobileLayout({ children }: MobileLayoutProps) {
  return (
    <div className='font-pretendard h-screen mx-auto max-w-md bg-green-100 relative flex flex-col items-center pb-16'>
      {children}
    </div>
  );
} 

// <div style={{
//   minHeight: '100vh',
//   background: '#f8fafc',
//   display: 'flex',
//   justifyContent: 'center',
//   alignItems: 'center',
// }}>
//   <div style={{
//     width: '100%',
//     maxWidth: 430,
//     minHeight: '100vh',
//     background: '#fff',
//     boxShadow: '0 0 16px 0 rgba(0,0,0,0.08)',
//     borderRadius: 16,
//     padding: 24,
//     boxSizing: 'border-box',
//     display: 'flex',
//     flexDirection: 'column',
//   }}>
//     {children}
//   </div>
// </div>
