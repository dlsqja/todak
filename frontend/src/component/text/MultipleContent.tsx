//``````````````````````🌝깡통 버전입니다🌝```````````````````````````````````````````
// ex)반려동물 정보
//  - 이름 : 뽀삐
//  - 나이 : 3세
//  - 동물 종류 : 고양이

import React from 'react';

interface MultipleContentProps {
  title: string;
  contents: string[];
}

const MultiContent: React.FC<MultipleContentProps> = ({ title, contents }) => {
  return (
    <div className="py-2">
      <h4 className="h4">{title}</h4> {/* 제목과 내용 간의 간격을 15px로 설정 */}
      <ul className="mt-2 space-y-[5px]"> {/* 각 항목 간 5px 간격 */}
        {contents.map((content, index) => (
          <li key={index} className="p">
            {content}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MultiContent;
