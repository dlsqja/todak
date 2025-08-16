import Button from '@/component/button/Button';
import { useNavigate } from 'react-router-dom';

export default function MainPage() {
  const navigate = useNavigate();
  const handleStart = () => {
    navigate('/auth');
  };

  return (
    <div
      className="flex flex-col items-center justify-center px-7 min-h-screen"
      style={{
        background: 'linear-gradient(-45deg, #afcf7e, #c8e6a0, #e9f1d7, #fdfcfb)',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '400% 400%',
        position: 'relative',
        animation: 'backgroundChange 4s ease-in-out infinite',
      }}
    >
      <style>{`
        @keyframes backgroundChange {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>

      <div className="flex items-center mb-7">
        <img src="images/todoc_logo.png" alt="logo" className="w-30 h-40" />
      </div>
      {/* <h3 className="h3 text-brown-300 text-center">바쁜 현대인들을 위한</h3> */}
      {/* <h3 className="h3 text-brown-300 text-center mb-5">반려동물 비대면 의료 서비스</h3> */}

      <div className="w-full px-10">
        <button
          className="w-full h-13 rounded-[12px] bg-green-300 text-green-100 h4 cursor-pointer shadow-lg hover:bg-green-400 transition-shadow duration-200"
          onClick={handleStart}
        >
          시작하기
        </button>
      </div>
    </div>
  );
}
