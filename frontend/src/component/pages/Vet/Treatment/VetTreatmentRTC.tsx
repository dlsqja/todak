import BackHeader from '@/component/header/BackHeader';
import CallingIcon from '@/component/icon/CallingIcon';
import SpeakIcon from '@/component/icon/SpeakIcon';
import VoiceIcon from '@/component/icon/VoiceIcon';

export default function OwnerTreatmentRTC() {
  return (
    <div>
      <BackHeader text="진료 화면" />
      <div className="flex flex-col justify-center items-center gap-4">
        <div className="w-50 h-50 bg-gray-300 flex flex-col gap-2">수의사 화면</div>
        <div className="w-50 h-50 bg-gray-300 flex flex-col gap-2">반려인 화면</div>
        <div className="flex justify-center items-center gap-10 mt-5">
          <div className="cursor-pointer">
            <VoiceIcon />
          </div>
          <div className="cursor-pointer">
            <CallingIcon />
          </div>
          <div className="cursor-pointer">
            <SpeakIcon />
          </div>
        </div>
      </div>
    </div>
  );
}
