import Button from '@/component/button/Button';
import { useNavigate } from 'react-router-dom';
export default function MainPage() {
  const navigate = useNavigate();
  const handleStart = () => {
    navigate('/auth');
  };

  return (
    <div className="flex flex-col items-center justify-center px-7 pt-30">
      <div className="flex items-cente mb-7">
        <img src="images/todoc_logo.png" alt="logo" className="w-30 h-40 " />
      </div>
      <h1 className="h3 text-center"> 병원 방문 번거로움을 해결하는</h1>
      <span className="h3 text-center mb-5">비대면 의료 서비스</span>

      <div className="w-full px-10">
        <Button text="시작하기" color="green" onClick={handleStart} className="w-full" />
      </div>
    </div>
  );
}
