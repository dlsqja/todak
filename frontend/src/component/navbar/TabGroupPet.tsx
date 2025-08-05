import React from 'react';

interface Props {
  selected: string;
  onSelect: (tab: string) => void;
}

export default function TabGroupPet({ selected, onSelect }: Props) {
  const tabs = ['상세 정보', '진료 내역'];
  return (
    <div className="flex justify-center gap-30">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onSelect(tab)}
          className={`h4 ${selected === tab ? 'h4 border-b-2 border-black' : 'h4 text-gray-500'}`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
