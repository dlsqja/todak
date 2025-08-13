import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";

interface SearchInputProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ placeholder, value, onChange }) => {
  const [isFocused, setIsFocused] = useState(false); // 👉 포커스 여부 상태

  return (
    <div
      className={`w-full h-12 px-4 py-3 flex items-center gap-2 rounded-[12px] border
        bg-white transition-colors duration-200
        ${isFocused ? 'border-green-300' : 'border-gray-400'}
      `}
    >
      <FiSearch className="text-gray-400 text-xl" />
      <input
        type="text"
        className="w-full bg-transparent outline-none placeholder:text-gray-400 text-gray-900 p leading-[24px]"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}    // 👉 포커스되면 초록 테두리
        onBlur={() => setIsFocused(false)}    // 👉 포커스 벗어나면 회색 테두리
      />
    </div>
  );
};

export default SearchInput;
