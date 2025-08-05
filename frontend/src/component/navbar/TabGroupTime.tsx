import React from "react";

interface Props {
  selected: string;
  onSelect: (tab: string) => void;
}

export default function TabGroupTime({ selected, onSelect }: Props) {
  const tabs = ["진료 가능 시간", "예약 목록"];
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
