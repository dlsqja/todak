import React from 'react';

interface SearchListItemProps {
  name: string;
  description: string;
  onClick?: () => void;
}

const SearchListItem: React.FC<SearchListItemProps> = ({ name, description, onClick }) => {
  return (
    <div
      className="flex items-center px-7 py-3 bg-white w-full cursor-pointer"
      onClick={onClick}
    >
      <div className="w-12 h-12 rounded-full bg-green-200" />
      <div className="ml-3 flex flex-col justify-center">
        <span className="h4 text-black">{name}</span>
        <span className="caption text-gray-400">{description}</span>
      </div>
    </div>
  );
};

export default SearchListItem;
