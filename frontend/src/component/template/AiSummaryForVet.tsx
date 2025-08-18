// src/component/template/AiSummaryForVet.tsx
import React, { useMemo, useState, useEffect } from 'react';
import Button from '@/component/button/Button';

interface AiSummaryForVetProps {
  label: string;
  summary: string;
  reservationDate: string;
  reservationTime: string;
  vetName: string;
  /** 0(미완료) | 1(완료) | boolean 모두 허용 */
  isCompleted?: 0 | 1 | boolean;
  onEditSummary?: () => void;
  onSignSummary?: () => void | Promise<void>;
}

// 타자기 효과 커스텀 훅 (문장부호 지연 + 건너뛰기 지원)
type TypewriterOptions = {
  baseSpeed?: number; // 기본 타자 속도(ms)
  periodPauseMs?: number; // . ! ? 뒤 지연
  commaPauseMs?: number; // , ; : 뒤 지연
  newlinePauseMs?: number; // 줄바꿈 지연
};

const useTypewriter = (text: string, options: TypewriterOptions | number = 50) => {
  const {
    baseSpeed = typeof options === 'number' ? options : options.baseSpeed ?? 50,
    periodPauseMs = typeof options === 'number' ? 250 : options.periodPauseMs ?? 250,
    commaPauseMs = typeof options === 'number' ? 120 : options.commaPauseMs ?? 120,
    newlinePauseMs = typeof options === 'number' ? 300 : options.newlinePauseMs ?? 300,
  } = typeof options === 'number' ? ({} as any) : options;

  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    let isCancelled = false;
    setDisplayText('');
    setIsTyping(true);

    if (!text) {
      setIsTyping(false);
      return;
    }

    const isPeriod = (ch: string) => /[.!?]/.test(ch);
    const isComma = (ch: string) => /[,;:]/.test(ch);

    const step = (index: number) => {
      if (isCancelled) return;
      if (index >= text.length) {
        setIsTyping(false);
        return;
      }

      const nextIndex = index + 1;
      const nextText = text.slice(0, nextIndex);
      setDisplayText(nextText);

      const char = text.charAt(index);
      let delay = baseSpeed;
      if (char === '\n') delay += newlinePauseMs;
      else if (isPeriod(char)) delay += periodPauseMs;
      else if (isComma(char)) delay += commaPauseMs;

      setTimeout(() => step(nextIndex), delay);
    };

    const startDelay = 100; // 시작시 약간의 지연으로 자연스럽게
    const timer = setTimeout(() => step(0), startDelay);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [text, baseSpeed, periodPauseMs, commaPauseMs, newlinePauseMs]);

  const skip = () => {
    setDisplayText(text || '');
    setIsTyping(false);
  };

  return { displayText, isTyping, skip };
};

const AiSummaryForVet: React.FC<AiSummaryForVetProps> = ({
  label,
  summary,
  reservationDate,
  reservationTime,
  vetName,
  isCompleted = false,
  onEditSummary,
  onSignSummary,
}) => {
  const signed = useMemo(() => isCompleted === 1 || isCompleted === true, [isCompleted]);
  const [revealed, setRevealed] = useState(false);
  const [skipAll, setSkipAll] = useState(false);
  const charGrid = useMemo(() => summary.split('\n').map((line) => Array.from(line)), [summary]);

  useEffect(() => {
    setSkipAll(false);
    setRevealed(false);
    const t = setTimeout(() => setRevealed(true), 30);
    return () => clearTimeout(t);
  }, [summary]);

  return (
    <div className="py-6">
      <h2 className="text-lg font-bold text-gray-800 mb-4">{label}</h2>

      <div className="bg-white rounded-[12px] shadow-[0px_5px_15px_rgba(0,0,0,0.08)] p-6 space-y-6">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="p text-black">진료일</span>
            <span className="h4 text-black">{reservationDate}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="p text-black">진료시간</span>
            <span className="h4 text-black">{reservationTime}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="p text-black">수의사</span>
            {signed ? (
              <span className="h4 text-black">{vetName || '—'}</span>
            ) : (
              <p className="h4 text-gray-400">아직 서명되지 않았습니다.</p>
            )}
          </div>
        </div>

        <div className="flex justify-end -mt-2">
          {!signed && !skipAll && (
            <button
              onClick={() => {
                setSkipAll(true);
                setRevealed(true);
              }}
              className="caption text-gray-400 hover:text-gray-600 underline"
            >
              건너뛰기
            </button>
          )}
        </div>
        <div
          className="p text-black !leading-6 !tracking-tight whitespace-pre-wrap"
          aria-live="polite"
          aria-atomic="false"
        >
          {charGrid.map((chars, rowIndex) => (
            <div key={`row-${rowIndex}`} className="inline-block w-full align-top">
              {chars.length === 0 ? (
                <br />
              ) : (
                chars.map((ch, colIndex) => {
                  const delayMs = (rowIndex + colIndex) * 18; // 대각선 스텝 지연
                  const style: React.CSSProperties = skipAll
                    ? { opacity: 1, transform: 'translate(0,0)' }
                    : {
                        opacity: revealed ? 1 : 0,
                        transform: revealed ? 'translate(0,0)' : 'translate(10px,10px)',
                        transitionProperty: 'opacity, transform',
                        transitionDuration: '260ms',
                        transitionTimingFunction: 'cubic-bezier(0.22,1,0.36,1)',
                        transitionDelay: `${delayMs}ms`,
                      };
                  return (
                    <span key={`c-${rowIndex}-${colIndex}`} style={style}>
                      {ch === ' ' ? '\u00A0' : ch}
                    </span>
                  );
                })
              )}
            </div>
          ))}
        </div>

        {/* ⬇️ 미서명일 때만 경고문 표시 */}
        {!signed && (
          <div className="caption text-center text-gray-500 bg-gray-200 px-3 py-2 rounded-[12px]">
            본 요약문은 AI로 생성되었으며 보호자의 확인을 돕기 위해 <br />
            이용되므로 내용을 잘 확인하고 서명함을 다시 확인해주세요.
          </div>
        )}

        {/* ⬇️ 미서명일 때만 버튼 표시 */}
        {!signed && (
          <div className="flex gap-3">
            <Button text="요약본 수정하기" color="lightgreen" onClick={onEditSummary} />
            <Button text="요약본 서명하기" color="green" onClick={onSignSummary} />
          </div>
        )}

        {/* 선택: 완료 안내 뱃지 */}
        {signed && (
          <div className="h4 text-center text-green-300 bg-gray-100 px-3 py-2 rounded-[12px] font-medium">
            서명이 완료되었습니다.
          </div>
        )}
      </div>
    </div>
  );
};

export default AiSummaryForVet;
