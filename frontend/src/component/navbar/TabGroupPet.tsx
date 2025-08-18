import React from 'react';

interface Props {
  selected: string;
  onSelect: (tab: string) => void;
}

export default function TabGroupPet({ selected, onSelect }: Props) {
  const tabs = ['상세 정보', '진료 내역'];
  return (
    <div className="flex justify-center gap-15">
      {tabs.map((tab) => (
        <div
          key={tab}
          onClick={() => onSelect(tab)}
          className={`w-20 h-9 cursor-pointer h4 ${
            selected === tab ? 'h4 text-center border-b-2 border-black' : 'h4 text-center text-gray-500'
          }`}
        >
          {tab}
        </div>
      ))}
    </div>
  );
}
