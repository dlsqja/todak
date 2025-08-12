// src/component/template/AiSummaryForVet.tsx
import React, { useMemo } from 'react';
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
  const signed = useMemo(
    () => isCompleted === 1 || isCompleted === true,
    [isCompleted]
  );

  return (
    <div className="py-6">
      <h2 className="text-lg font-bold text-gray-800 mb-4">{label}</h2>

      <div className="bg-white rounded-[12px] shadow-[0px_5px_15px_rgba(0,0,0,0.08)] p-6 space-y-6">
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
            {signed ? (
              <span className="h4 text-black">{vetName || '—'}</span>
            ) : (
              <p className="h4 text-gray-400">아직 서명되지 않았습니다.</p>
            )}
          </div>
        </div>

        <div className="h4 text-black leading-relaxed whitespace-pre-wrap">
          {summary}
        </div>

        {/* ⬇️ 미서명일 때만 경고문 표시 */}
        {!signed && (
          <div className="caption text-center text-gray-500 bg-gray-200 px-3 py-2 rounded-[12px]">
            본 요약문은 AI로 생성되었으며 보호자의 확인을 돕기 위해 <br />
            이용되므로 내용을 잘 확인하고 서명함을 다시 확인해주세요.
          </div>
        )}

        {/* ⬇️ 미서명일 때만 버튼 표시 */}
        {!signed && (
          <div className="flex gap-3">
            <Button text="요약본 수정하기" color="lightgreen" onClick={onEditSummary} />
            <Button text="요약본 서명하기" color="green" onClick={onSignSummary} />
          </div>
        )}

        {/* 선택: 완료 안내 뱃지 */}
        {signed && (
          <div className="h4 text-center text-green-300 bg-gray-100 px-3 py-2 rounded-[12px] font-medium">
            서명이 완료되었습니다.
          </div>
        )}
      </div>
    </div>
  );
};

export default AiSummaryForVet;
