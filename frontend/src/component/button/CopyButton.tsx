export default function CopyButton() {
  const animalCode = 'A409'; //  임시로 고정(실제 동물코드 값 입력력)

  const handleCopy = () => {
    navigator.clipboard.writeText(animalCode);
    alert('동물코드가 복사되었습니다!'); // 안내 메시지
  };

  return (
    <button
      className="w-14 h-6 rounded-[12px] h5 bg-gray-100 text-gray-500 cursor-pointer"
      onClick={handleCopy}
      type="button"
    >
      복사
    </button>
  );
}
