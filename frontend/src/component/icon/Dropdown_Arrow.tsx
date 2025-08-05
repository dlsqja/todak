interface DropdownArrowProps {
  fill?: string;
  stroke?: string;
  width?: number | string;
  height?: number | string;
}

const DropdownArrow = ({ fill = 'inherit ', stroke = 'inherit', width = 24, height = 24 }: DropdownArrowProps) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <mask
      id="mask0_2488_4230"
      style={{ maskType: 'alpha' }}
      maskUnits="userSpaceOnUse"
      x={0}
      y={0}
      width={24}
      height={24}
    >
      <rect x="0.5" y="0.5" width="23" height="23" fill={fill} stroke={stroke} />
    </mask>
    <g mask="url(#mask0_2488_4230)">
      <path d="M6.5 10L12 15L17.5 10" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  </svg>
);

export default DropdownArrow;
