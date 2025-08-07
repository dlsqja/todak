import React from 'react';

interface Props {
  selected: string;
  onSelect: (tab: string) => void;
}

export default function TabGroupWaiting({ selected, onSelect }: Props) {
  const tabs = ['대기', '승인', '반려'];
  return (
    <div className="flex justify-center gap-15">
      {tabs.map((tab) => (
        <div
          key={tab}
          onClick={() => onSelect(tab)}
          className={`w-9 h-9 cursor-pointer h4 ${
            selected === tab ? 'h4 text-center border-b-2 border-black' : 'h4 text-center text-gray-500'
          }`}
        >
          {tab}
        </div>
      ))}
    </div>
  );
}
