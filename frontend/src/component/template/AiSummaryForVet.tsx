import React from 'react';
import Button from '@/component/button/Button';

interface AiSummaryForVetProps {
  label: string;
  summary: string;
  reservationDate: string;
  reservationTime: string;
  vetName: string;
  onEditSummary?: () => void;
  onSignSummary?: () => void;
}

const AiSummaryForVet: React.FC<AiSummaryForVetProps> = ({
  label,
  summary,
  reservationDate,
  reservationTime,
  vetName,
  onEditSummary,
  onSignSummary,
}) => {
  return (
    <div className=" py-6">
      <h2 className="text-lg font-bold text-gray-800 mb-4">{label}</h2>
      <div className="bg-white rounded-[12px] shadow-[0px_5px_15px_rgba(0,0,0,0.08)] p-6 space-y-6">
        <div className="text-gray-800 leading-relaxed">{summary}</div>

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
            <span className="h4 text-black">{vetName}</span>
          </div>
        </div>
        <div className="flex gap-3">
          <Button text="요약본 수정하기" color="gray" />
          <Button text="요약본 서명하기" color="lightgreen" />
        </div>

        <div className="caption text-center text-gray-500">
          본 요약문은 AI로 생성되었으며 보호자의 확인을 돕기 위해 <br />
          이용되므로 내용을 잘 확인하고 서명함을 다시 확인해주세요.
        </div>
      </div>
    </div>
  );
};

export default AiSummaryForVet;
