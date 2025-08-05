import React from "react";

interface Props {
  selected: string;
  onSelect: (tab: string) => void;
}

export default function TabGroupWaiting({ selected, onSelect }: Props) {
  const tabs = ["대기", "승인", "반려"];
  return (
    <div className="flex justify-between">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onSelect(tab)}
          className={`text-sm ${
            selected === tab ? "font-semibold border-b-2 border-black" : "text-gray-500"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
