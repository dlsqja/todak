interface DropdownArrowProps {
  fill?: string;
  stroke?: string;
  width?: number | string;
  height?: number | string;
  className?: string;
}

const DropdownArrow = ({
  fill = 'none',
  stroke = 'currentColor',
  width = 24,
  height = 24,
  className = '',
}: DropdownArrowProps) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill={fill}
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M6.5 10L12 15L17.5 10"
      stroke={stroke}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default DropdownArrow;
