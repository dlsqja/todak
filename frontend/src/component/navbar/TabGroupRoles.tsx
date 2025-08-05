import React from 'react';

interface Props {
  selected: string;
  onSelect: (tab: string) => void;
}

export default function TabGroupRoles({ selected, onSelect }: Props) {
  const tabs = ['반려인', '수의사', '병원 관계자'];
  return (
    <div className="flex justify-center gap-15">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onSelect(tab)}
          className={`h4 ${selected === tab ? 'h4 border-b-2 text-center border-black' : 'h4 text-gray-500'}`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
