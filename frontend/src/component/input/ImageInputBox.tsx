interface ImageBoxProps {
  src?: string; // 이미지 경로(필수)
  alt?: string; // 대체 텍스트(선택)
}

export default function ImageInputBox({ src, alt }: ImageBoxProps) {
  return (
    <div className="w-22 h-22 bg-gray-500 rounded-lg ">
      {src ? <img src={src} alt={alt} className="max-w-full max-h-full object-contain" /> : null}
    </div>
  );
}
