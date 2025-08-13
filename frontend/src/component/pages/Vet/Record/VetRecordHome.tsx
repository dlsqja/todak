// src/component/pages/Vet/Record/VetRecordHome.tsx
import React, { useState, useEffect } from 'react';
import SimpleHeader from '@/component/header/SimpleHeader';
import TabGroupTreatList from '@/component/navbar/TabGroupTreatList';
import VetRecordListFilter from './VetRecordListFilter';
import VetRecordDateFilter from './VetRecordDateFilter';
import { useNavigate } from 'react-router-dom';
import { getVetTreatments } from '@/services/api/Vet/vettreatment';
import SelectionDropdown from '@/component/selection/SelectionDropdown';

export default function VetRecord() {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState('목록형');

  // ✅ type 상태: '2' 전체 / '0' 진행중(완료 전) / '1' 완료
  const [historyType, setHistoryType] = useState<'0' | '1' | '2'>('2');
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  (async () => {
    try {
      setLoading(true);
      const data = await getVetTreatments(Number(historyType) as 0|1|2);
      setList(Array.isArray(data) ? data : []);
      
    } catch (e) {
      console.warn('진료 리스트 불러오기 실패:', e);
      setList([]);
    } finally {
      setLoading(false);
    }
  })();
}, [historyType]);

  const handleTabSelect = (tab: string) => {
    setSelectedTab(selectedTab === tab ? '목록형' : tab);
  };

  if (loading) return <div className="p px-7 py-6">불러오는 중…</div>;

  return (
    <div className="flex flex-col gap-3">
      <SimpleHeader text="진료 기록" />
      <TabGroupTreatList onSelect={handleTabSelect} />

     

      {selectedTab === '목록형' ? (
        <VetRecordListFilter
          data={list}
          onCardClick={(id) => navigate(`/vet/records/detail/${id}`)}
        />
      ) : (
        <VetRecordDateFilter
          data={list}
          onCardClick={(id) => navigate(`/vet/records/detail/${id}`)}
        />
      )}
    </div>
  );
}
