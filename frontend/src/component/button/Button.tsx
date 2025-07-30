interface SubmitButtonProps {
  bgcolor?: string;      
  textcolor?: string;     
  text?: string;        
  className?: string;  
  rounded?: string;
}
 
export default function SubmitButton({
    // 기본값 설정
  bgcolor = 'green-200',
  textcolor = 'black',
  text = '제출용 버튼 입니다',
  rounded = 'lg',
  className = '',
  ...props
}: SubmitButtonProps) {
  return (
    <button
    // props 변수로 받을 항목 설정
      className={`w-full bg-${bgcolor} text-${textcolor} rounded-${rounded} ${className}`}
      {...props}
    >
      {text}
    </button>
  );
}
 