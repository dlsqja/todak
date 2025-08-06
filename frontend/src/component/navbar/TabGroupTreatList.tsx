import React, { useState } from 'react';

interface Props {
  onSelect: (tab: string) => void;
}

export default function TabGroupTreatList({ onSelect }: Props) {
  const [selected, setSelected] = useState('목록형');
  const tabs = ['목록형', '날짜형'];
  return (
    <div className="px-5 w-full flex justify-center gap-12 border-b-2 border-gray-100">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => {
            onSelect(tab);
            setSelected(tab);
          }}
          className={`pb-2 h4 cursor-pointerD ${
            selected === tab ? 'h4 text-black border-b-2 border-black' : 'h4 text-center text-gray-500'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
