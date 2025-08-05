import React from "react";
import { FiSearch } from "react-icons/fi";

interface SearchInputProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ placeholder, value, onChange }) => {
  return (
    <div className="w-full h-12 px-4 py-3 flex items-center gap-2 rounded-[12px] border-2 border-gray-400 bg-white">
      <FiSearch className="text-gray-500 text-xl" />
      <input
        type="text"
        className="w-full bg-transparent outline-none placeholder:text-gray-400 text-gray-900 p leading-[24px]"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default SearchInput;
