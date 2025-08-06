import React, { useState, useEffect } from 'react';
import DropdownArrow from '@/component/icon/Dropdown_Arrow';

interface OptionType {
  value: string;
  label: string;
}
interface DataType {
  id: number;
  name: string;
  cat: boolean;
  dog: boolean;
}
interface FilteredListProps {
  options: OptionType[];
  api_url?: string;
}

export default function FilteredList({ options, api_url = '' }: FilteredListProps) {
  // const [allData, setAllData] = useState<DataType[]>([]);

  // 테스트용 더미데이터
  const [allData, setAllData] = useState<DataType[]>([
    { id: 1, name: '나비', cat: true, dog: false },
    { id: 2, name: '초코', cat: false, dog: true },
    { id: 3, name: '야옹이', cat: true, dog: false },
  ]);

  const [selected, setSelected] = useState('');

  // api_url 사용 시 주석 해제
  //   useEffect(() => {
  //     const Data = async () => {
  //       try {
  //         const res = await fetch(`${api_url}`);
  //         const data = await res.json();
  //         setAllData(data);
  //       } catch (error) {
  //         console.error('데이터 불러오기 실패:', error);
  //       }
  //     };
  //     Data();
  //   }, [api_url]);

  // 필터링
  const filteredList =
    selected === '' || selected === 'all'
      ? allData
      : allData.filter((item) => item[selected as keyof DataType]);

  return (
    <div>
      <div className="relative">
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="w-full border border-gray-400 h-12 appearance-none 
        focus:outline-none 
        hover:outline-none 
        bg-green-100 rounded-2xl px-4 py-2"
        >
          <option value="" disabled hidden>
            전체
          </option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
          <DropdownArrow width={24} height={24} />
        </span>
      </div>
      <ul className="mx-4">
        {filteredList.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}
