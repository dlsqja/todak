import React from 'react';

interface SimpleHeaderProps {
  text: string;
}

const SimpleHeader: React.FC<SimpleHeaderProps> = ({ text }) => {
  return (
    <div
      className="
      h4
        w-full h-12
        bg-green-100
        flex items-center justify-center
        px-4
        
      "
    >
      {text}
    </div>
  );
};

export default SimpleHeader;
