import React from 'react';
import { useParams } from 'react-router-dom';
import BackHeader from '@/component/header/BackHeader';
import ImageInputBox from '@/component/input/ImageInputBox';

const MOCK_TREATMENTS = [
  {
    id: 1,
    summary:
      '지금 일어나는 현상은 회복을 하기 위해 발생하는 자연스러운 현상이니 너무 놀라지 않으셔도 됩니다. 잊지 않고 약을 잘 도포해주시고 그 외의 이상이 있다면 다시 진료 신청 부탁드립니다.',
    date: '2025.07.25',
    time: '21:01 - 21:23',
    vetName: '이대연',
    description:
      '피부에 뭐가 나서 저번에 병원에 가서 연고 발라주고 했는데도 계속 붉은 기운이 있는 것 같아요. 오히려 조금 뭐가 올라오는 것 같은데 이럴 때는 어떻게 해야 할 지를 모르겠네요. 약이 이상한 건가요???',
    photoUrl: '', // 있으면 넣기
  },
  {
    id: 2,
    summary: '약 복용 후 경과가 좋아지고 있어 현재로선 큰 문제 없어 보입니다.',
    date: '2025.07.22',
    time: '18:30 - 18:45',
    vetName: '김철수',
    description: '기침이 잦아서 병원에 왔는데 괜찮아졌는지 확인받고 싶어요.',
    photoUrl: '',
  },
];

export default function TreatmentDetailPage() {
  const { id } = useParams();
  const record = MOCK_TREATMENTS.find((item) => item.id === Number(id));

  if (!record) {
    return <div className="text-center mt-20">진료 기록을 찾을 수 없습니다.</div>;
  }

  return (
    <div className="bg-white min-h-screen pb-28">
      <BackHeader text="진료 내역 상세" />

      {/* AI 요약 진단서 */}
      <section className="px-6 mt-8 space-y-3">
        <h4 className="h4 text-black">AI 요약 진단서</h4>
        <div className="bg-white rounded-[12px] shadow-[0px_5px_15px_rgba(0,0,0,0.08)] px-5 py-6 space-y-5">
          <p className="p text-black leading-relaxed whitespace-pre-wrap">{record.summary}</p>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="p text-black">진료일</span>
              <span className="h4 text-black">{record.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="p text-black">진료시간</span>
              <span className="h4 text-black">{record.time}</span>
            </div>
            <div className="flex justify-between">
              <span className="p text-black">수의사</span>
              <span className="h4 text-black">{record.vetName}</span>
            </div>
          </div>

          <p className="caption text-center text-gray-500">
            본 요약문은 AI로 생성되었으며 수의사의 확인 절차를 통해 검증된 내용이지만,
            법적 효력은 없는 자료임을 명시합니다.
          </p>
        </div>
      </section>

      {/* 신청 내용 */}
      <section className="px-6 mt-9 space-y-3">
        <h4 className="h4 text-black">신청 내용</h4>
        <div className="flex gap-4">
          <ImageInputBox src={record.photoUrl} />
          <p className="p text-black leading-relaxed whitespace-pre-wrap">{record.description}</p>
        </div>
      </section>
    </div>
  );
}
