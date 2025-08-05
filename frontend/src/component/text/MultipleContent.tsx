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
        <div style={{ padding: '10px', borderRadius: '8px' }}>
            <h2 style={{ fontWeight: 'bold', marginBottom: '15px' }}>{title}</h2>
            <ul>
                {contents.map((content, index) => (
                    <li key={index} style={{ marginBottom: '5px' }}>{content}</li> // 각 내용 항목의 간격 추가
                ))}
            </ul>
        </div>
    );
};

export default MultiContent;