import Button from '@/component/button/Button';
import { useNavigate } from 'react-router-dom';

export default function MainPage() {
  const navigate = useNavigate();
  const handleStart = () => {
    navigate('/auth');
  };

  return (
    <div className="flex flex-col items-center justify-center gap-10 px-7">
      <h1 className="h1">토닥</h1>
      <h2 className="h2">로고 이미지</h2>
      <Button text="시작하기" color="green" onClick={handleStart} className="w-full" />
    </div>
  );
}
