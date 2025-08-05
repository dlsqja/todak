interface ButtonProps {
  color: string;
  text: string;
  className?: string;
  onClick?: () => void;
}

export default function Button({ color, text, className = '', onClick }: ButtonProps) {
  const colorVariants = {
    lightgreen: 'bg-green-200',
    green: 'bg-green-300 text-green-100',
    pink: 'bg-pink-100',
    gray: 'bg-gray-100',
  };
  return (
    <button
      onClick={onClick}
      className={`cursor-pointer w-full h-13 rounded-[12px] h4 ${
        colorVariants[color as keyof typeof colorVariants]
      } ${className}`}
    >
      {text}
    </button>
  );
}
