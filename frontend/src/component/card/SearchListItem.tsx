import React from 'react';

interface SearchListItemProps {
  name: string;
  description: string;
  imageUrl?: string;
  onClick?: () => void;
}

const SearchListItem: React.FC<SearchListItemProps> = ({ name, description, imageUrl, onClick }) => {
  return (
    <div className="flex items-center px-0 py-3 bg-gray-50 w-full cursor-pointer" onClick={onClick}>
      {/* 동그라미 영역 */}
      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-200 flex items-center justify-center overflow-hidden aspect-square">
        {imageUrl && imageUrl.trim() !== '' ? (
          <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
        ) : (
          <img src="/images/person_default.png" alt={name} className="w-full h-full object-cover" />
        )}
      </div>

      {/* 텍스트 영역 */}
      <div className="ml-3 flex flex-col justify-center">
        <span className="h4 text-black">{name}</span>
        <span className="caption text-gray-400">{description}</span>
      </div>
    </div>
  );
};

export default SearchListItem;
