import React from 'react';
import OwnerMenuBar from '@/component/navbar/OwnerMenuBar';


interface MobileLayoutProps {
  children: React.ReactNode;
}

export default function MobileLayout({ children }: MobileLayoutProps) {
  return (
    <div className='h-screen mx-auto max-w-md bg-gray-200 relative flex flex-col pb-16'>
      {/* <OwnerMenuBar /> */}
      {children}
    </div>
  );
} 


