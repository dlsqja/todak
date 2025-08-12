// src/component/template/AiSummaryForVet.tsx
import React, { useEffect, useMemo, useState } from 'react';
import Button from '@/component/button/Button';

interface AiSummaryForVetProps {
  label: string;
  summary: string;
  reservationDate: string;
  reservationTime: string;
  vetName: string;
  /** 0(미완료) | 1(완료) | boolean 모두 허용 */
  isCompleted?: 0 | 1 | boolean;
  onEditSummary?: () => void;
  /** 서명 버튼 눌렀을 때 호출됨(백엔드 저장은 여기서 처리 가능) */
  onSignSummary?: () => void | Promise<void>;
}

const AiSummaryForVet: React.FC<AiSummaryForVetProps> = ({
  label,
  summary,
  reservationDate,
  reservationTime,
  vetName,
  isCompleted = false,
  onEditSummary,
  onSignSummary,
}) => {
  // prop → 내부 상태 동기화
  const initialSigned = useMemo(
    () => isCompleted === 1 || isCompleted === true,
    [isCompleted],
  );
  const [signed, setSigned] = useState<boolean>(initialSigned);
  const [signing, setSigning] = useState<boolean>(false);

  useEffect(() => {
    setSigned(initialSigned);
  }, [initialSigned]);

  const displayVetName = signed ? vetName : '아직 서명되지 않았습니다.';

  const handleSignClick = async () => {
    if (signed || signing) return;
    try {
      setSigning(true);
      // 부모에서 실제 API 저장하고 싶다면 여기서 실행됨
      await onSignSummary?.();
      // UI 상태 완료 처리
      setSigned(true);
    } finally {
      setSigning(false);
    }
  };

  return (
    <div className="py-6">
      <h2 className="text-lg font-bold text-gray-800 mb-4">{label}</h2>
      <div className="bg-white rounded-[12px] shadow-[0px_5px_15px_rgba(0,0,0,0.08)] p-6 space-y-6">
        <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
          {summary}
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="p text-black">진료일</span>
            <span className="h4 text-black">{reservationDate}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="p text-black">진료시간</span>
            <span className="h4 text-black">{reservationTime}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="p text-black">수의사</span>
            <span className="h4 text-black">
              {displayVetName}
            </span>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            text="요약본 수정하기"
            color="lightgreen"
            onClick={onEditSummary}
          />
          <Button
            text={signed ? '서명 완료' : signing ? '서명 중…' : '요약본 서명하기'}
            color="green"
            onClick={handleSignClick}
            disabled={signed || signing}
          />
        </div>

        <div className="caption text-center text-gray-500 bg-gray-200 px-3 py-2 rounded-[12px]">
          본 요약문은 AI로 생성되었으며 보호자의 확인을 돕기 위해 <br />
          이용되므로 내용을 잘 확인하고 서명함을 다시 확인해주세요.
        </div>
      </div>
    </div>
  );
};

export default AiSummaryForVet;
