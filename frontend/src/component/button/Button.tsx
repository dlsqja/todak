
interface SubmitButtonProps {
  color?: string;
  text?: string;
  className?: string;
}

export default function SubmitButton({color, text, className}: SubmitButtonProps) {
  const colorVariants = {
    lightgreen: 'bg-green-200',
    green: 'bg-green-300 text-green-100',
    pink:  'bg-pink-100',
    gray:  'bg-gray-100',
  }
  return (
    <button className={`w-full h-13 rounded-[12px] h4 ${colorVariants[color as keyof typeof colorVariants]} ${className}`}>
      {text}
    </button>
  );
}