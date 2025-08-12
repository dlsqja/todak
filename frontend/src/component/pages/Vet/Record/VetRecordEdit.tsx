// src/component/pages/Vet/Record/VetRecordEdit.tsx
import React, { useEffect, useState } from 'react';
import BackHeader from '@/component/header/BackHeader';
import Button from '@/component/button/Button';
import { useNavigate, useParams } from 'react-router-dom';
import { getVetTreatmentDetail, updateVetTreatment } from '@/services/api/Vet/vettreatment';

export default function VetRecordEdit() {
  const { treatmentId } = useParams<{ treatmentId: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [text, setText] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!treatmentId || Number.isNaN(Number(treatmentId))) {
      setErr('잘못된 경로예요.');
      setLoading(false);
      return;
    }
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const d = await getVetTreatmentDetail(Number(treatmentId));
        const current =
          (d as any).aiSummary ??
          (d as any).ai_summary ??
          (d as any).result ??
          '';
        setText(current);
      } catch (e) {
        console.error('[VetRecordEdit] fetch error:', e);
        setErr('요약본을 불러오지 못했어요.');
      } finally {
        setLoading(false);
      }
    })();
  }, [treatmentId]);

  const handleSave = async () => {
    if (!treatmentId) return;
    try {
      setSaving(true);
      await updateVetTreatment(Number(treatmentId), { aiSummary: text });
      // 저장 후 상세로 돌아가기
      navigate(`/vet/records/detail/${treatmentId}`, {
        replace: true,
        state: { updated: true },
      });
    } catch (e) {
      console.error('[VetRecordEdit] save error:', e);
      alert('저장에 실패했어요. 잠시 후 다시 시도해주세요.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p px-7 py-6">불러오는 중…</div>;

  return (
    <div>
      <BackHeader text="요약본 수정" />
      <div className="px-7 mt-6">
        {err && <p className="caption text-red-500 mb-3">{err}</p>}

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="요약 내용을 입력해주세요"
          className="w-full h-40 block border-1 rounded-[12px] border-gray-400 px-5 pt-3 pb-3 text-black placeholder:text-gray-500 resize-none align-top whitespace-pre-wrap break-words scrollbar-hide"
          disabled={saving}
        />

        <div className="flex gap-3 mt-4">
          <Button color="gray" text="취소" onClick={() => navigate(-1)} />
          <Button color="green" text={saving ? '저장 중…' : '저장하기'} onClick={handleSave} />
        </div>
      </div>
    </div>
  );
}
