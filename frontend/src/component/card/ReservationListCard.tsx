import React from 'react';
import '@/styles/theme.css';

interface TreatmentRecordCardProps {
  doctorName: string;
  hospitalName: string;
  treatmentDate: string;
  department: string;
  onClickDetail?: () => void;
}

const TreatmentRecordCard: React.FC<TreatmentRecordCardProps> = ({
  doctorName,
  hospitalName,
  treatmentDate,
  department,
  onClickDetail,
}) => {
  return (
    <div className="w-full p-4 bg-white rounded-[12px] border border-gray-400">
      <div className="flex justify-between items-start">
        {/* 왼쪽: 텍스트 묶음 */}
        <div className="space-y-1">
          <div className="flex items-center">
            <span className="h5 font-bold min-w-[64px]">의사명</span>
            <span className="h5 ml-2">{doctorName}</span>
          </div>
          <div className="flex items-center">
            <span className="h5 font-bold min-w-[64px]">병원명</span>
            <span className="h5 ml-2">{hospitalName}</span>
          </div>
          <div className="flex items-center">
            <span className="h5 font-bold min-w-[64px]">예약시간</span>
            <span className="h5 ml-2">{treatmentDate}</span>
          </div>
          <div className="flex items-center">
            <span className="h5 font-bold min-w-[64px]">과목</span>
            <span className="h5 ml-2">{department}</span>
          </div>
        </div>

        {/* 오른쪽: 상세보기 버튼 */}
        <button
          onClick={onClickDetail}
          className="h5 px-3 py-1 text-brown-300 rounded-full bg-green-200 text-brown-300 cursor-pointer"
        >
          상세 보기
        </button>
      </div>
    </div>
  );
};

export default TreatmentRecordCard;
