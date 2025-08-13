import Button from '@/component/button/Button';
import { useNavigate } from 'react-router-dom';

export default function MainPage() {
  const navigate = useNavigate();
  const handleStart = () => {
    navigate('/auth');
  };

  return (
    <div
      className="flex flex-col items-center justify-center px-7 pt-30 min-h-screen"
      style={{
        backgroundImage: 'linear-gradient(60deg, #64b3f4, #c2e59c, #64b3f4, #c2e59c)',
        backgroundSize: '400% 400%',
        animation: 'gradientFlow 15s ease-in-out infinite',
      }}
    >
      <style>{`
        @keyframes gradientFlow {
          0% {
            background-position: 0% 0%;
          }
          25% {
            background-position: 100% 0%;
          }
          50% {
            background-position: 100% 100%;
          }
          75% {
            background-position: 0% 100%;
          }
          100% {
            background-position: 0% 0%;
          }
        }
      `}</style>

      <div className="flex items-center mb-7">
        <img src="images/todoc_logo.png" alt="logo" className="w-30 h-40" />
      </div>
      <h3 className="h3 text-brown-300 text-center">바쁜 현대인들을 위한</h3>
      <h3 className="h3 text-brown-300 text-center mb-5">반려동물 비대면 의료 서비스</h3>

      <div className="w-full px-10">
        <Button text="시작하기" color="green" onClick={handleStart} className="w-full" />
      </div>
    </div>
  );
}
