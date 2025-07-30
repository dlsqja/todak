// ex)의사소개 - 안녕하세요 수의사 ㅇㅇㅇ입니다.

import React from 'react';

interface SingleContentProps {
    title: string;
    content: string;
}

const SingleContent: React.FC<SingleContentProps> = ({ title, content }) => {
    return (
        <div style={{ padding: '10px', borderRadius: '8px' }}>
            <h2 style={{ fontWeight: 'bold', marginBottom: '15px' }}>{title}</h2> {/* 제목과 내용 간의 간격을 15px로 설정 */}
            <p style={{ marginTop: '5px' }}>{content}</p> {/* 내용과 제목 사이에 간격을 추가 */}
        </div>
    );
};

export default SingleContent;


