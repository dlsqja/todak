import React from 'react';
import Button from '../button/Button';
import ImageInputBox from '../input/ImageInputBox';

interface RemoteTreatmentCardProps {
  buttonText?: string;
  petName?: string;
  petInfo?: string;
  department?: string;
  symptom?: string;
  time?: string;
  photo?: string;
  onClick?: () => void;
}

const OwnerRemoteTreatmentCard: React.FC<RemoteTreatmentCardProps> = ({
  buttonText = '',
  petName = '',
  petInfo = '',
  department = '',
  symptom = '',
  time = '',
  photo = '',
  onClick,
}) => {
  return (
    <div
      className="w-full h-full bg-white rounded-[12px] shadow-[0px_5px_15px_rgba(0,0,0,0.08)] px-6 py-4 flex flex-col justify-between cursor-pointer"
      onClick={onClick}
    >
      {/* 상단: 이미지 + 이름/정보 + 시간/과 */}
      <div className="flex justify-between">
        <div className="flex gap-4 items-center">
          <div className="flex items-center justify-center">
            <div className="w-full h-full">
              <ImageInputBox src={photo} />
            </div>
          </div>
          <div className="flex flex-col">
            <h4 className="h3 text-black">{petName}</h4>
            <h4 className="h4 text-black">{petInfo}</h4>
          </div>
        </div>
        <div className="flex flex-col items-end justify-center  ">
          <h4 className="h4 text-black">{time}</h4>
          <h4 className="h4 text-black">{department}</h4>
        </div>
      </div>

      {/* 중단: 증상 */}
      {symptom && symptom.trim() !== '' && (
        <div className="my-2">
          <h4 className="h4 text-black">증상</h4>
          <p className="p text-black">{symptom}</p>
        </div>
      )}
    </div>
  );
};

export default OwnerRemoteTreatmentCard;
