import React from 'react';

interface SimpleHeaderProps {
  text: string;
}

const SimpleHeader: React.FC<SimpleHeaderProps> = ({ text }) => {
  return (
    <div
      className="
      h4
        w-full h-16
        bg-green-100
        flex items-center justify-center
        px-4
        sticky top-0 z-50
        
      "
    >
      {text}
    </div>
  );
};

export default SimpleHeader;
