import React from 'react';

interface Props {
  selected: string;
  onSelect: (tab: string) => void;
}

export default function TabGroupTreatList({ selected, onSelect }: Props) {
  const tabs = ['목록형', '날짜형'];
  return (
    <div className="flex justify-center gap-15">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onSelect(tab)}
          className={`h4 ${selected === tab ? 'font-semibold border-b-2 border-black' : 'h4 text-gray-500'}`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
