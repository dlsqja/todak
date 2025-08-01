//``````````````````````🌝완성품 버전🌝```````````````````````````````````
//``````````````````````❌테스트 필요❌```````````````````````````````````
// ex)반려동물 정보
//  - 이름 : 뽀삐
//  - 나이 : 3세
//  - 동물 종류 : 고양이

import React, { useEffect, useState } from 'react';

interface MultiContentProps {
  table: string;
  columns: string[];
}

const MultiContent: React.FC<MultiContentProps> = ({ table, columns }) => {
  const [contents, setContents] = useState<string[]>([]);
  const [title, setTitle] = useState<string>(`${table} 정보`);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const query = `columns=${columns.join(",")}`;
        const res = await fetch(`/api/fetch-columns?table=${table}&${query}`);
        const data = await res.json();

        const formatted = columns.map((col) => `${col} : ${data[col]}`);
        setContents(formatted);
      } catch (err) {
        console.error('데이터를 불러오는 중 오류 발생:', err);
      }
    };

    fetchData();
  }, [table, columns]);

  return (
    <div style={{ padding: '10px', borderRadius: '8px' }}>
      <h2 style={{ fontWeight: 'bold', marginBottom: '15px' }}>{title}</h2>
      <ul>
        {contents.map((content, index) => (
          <li key={index} style={{ marginBottom: '5px' }}>{content}</li>
        ))}
      </ul>
    </div>
  );
};

export default MultiContent;


// 부모 컴포넌트 활용 예시
/* <MultiContent
  table="반려동물정보"
  columns={["이름", "나이", "종류"]}
/>
*/

//백엔드 예시
/*
// Express 예시
app.get('/api/fetch-columns', async (req, res) => {
  const { table, columns } = req.query; // table: '반려동물정보', columns: '이름,나이,종류'

  const columnList = columns.split(',').map(col => `"${col}"`).join(', ');
  const query = `SELECT ${columnList} FROM ${table} LIMIT 1`; // 단일 row 예시

  const result = await db.query(query);
  res.json(result.rows[0]); // 예: { 이름: '뽀삐', 나이: 3, 종류: '고양이' }
});
*/
