import React from 'react';

interface PlusIconProps {
  fill?: string;
  stroke?: string;
  width?: number | string;
  height?: number | string;
}

const PlusIcon: React.FC<PlusIconProps> = ({ fill = 'inherit', stroke = 'inherit', width = 31, height = 31 }) => (
  <svg width={width} height={height} stroke={stroke} viewBox="0 0 31 31" fill={fill} xmlns="http://www.w3.org/2000/svg">
    <rect x="0.5" y="0.5" width="30" height="30" rx="15" fill={fill} stroke={stroke} />
    <path
      d="M18.6677 15.9921H15.9815V18.9444H15.0861V15.9921H12.3999V15.0079H15.0861V12.0555H15.9815V15.0079H18.6677V15.9921Z"
      fill={fill}
    />
  </svg>
);

export default PlusIcon;
