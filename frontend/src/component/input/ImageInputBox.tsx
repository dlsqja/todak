interface ImageBoxProps {
  src?: string; // 이미지 경로(필수)
  stroke?: string;
}

export default function ImageInputBox({ src, stroke }: ImageBoxProps) {
  return (
    <div className={`w-22 h-22 bg-gray-500 rounded-[16px] flex items-center justify-center overflow-hidden ${stroke}`}>
      {src ? <img src={src} alt="기본 프로필" className="w-full h-full object-cover" /> : null}
    </div>
  );
}
