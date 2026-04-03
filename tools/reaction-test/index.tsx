'use client';
import { useState, useRef, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import type { ToolMeta } from '../registry';
import { type GameState, getRandomDelay, getReactionRating } from './logic';

export default function ReactionTestTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.reaction-test');
  const [state, setState] = useState<GameState>('idle');
  const [reactionTime, setReactionTime] = useState(0);
  const [history, setHistory] = useState<number[]>([]);
  const startTimeRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null as any);

  const handleClick = useCallback(() => {
    if (state === 'idle' || state === 'result' || state === 'too-early') {
      setState('waiting');
      timerRef.current = setTimeout(() => {
        setState('ready');
        startTimeRef.current = Date.now();
      }, getRandomDelay());
    } else if (state === 'waiting') {
      clearTimeout(timerRef.current);
      setState('too-early');
    } else if (state === 'ready') {
      const ms = Date.now() - startTimeRef.current;
      setReactionTime(ms);
      setHistory(prev => [...prev, ms]);
      setState('result');
    }
  }, [state]);

  const avg = history.length > 0 ? Math.round(history.reduce((a, b) => a + b, 0) / history.length) : 0;
  const best = history.length > 0 ? Math.min(...history) : 0;

  const bgColor = state === 'waiting' ? 'bg-red-500' : state === 'ready' ? 'bg-green-500' : state === 'too-early' ? 'bg-yellow-500' : 'bg-blue-500';
  const message = state === 'idle' ? 'Click to Start' : state === 'waiting' ? 'Wait for green...' : state === 'ready' ? 'CLICK NOW!' : state === 'too-early' ? 'Too early! Click to retry' : `${reactionTime}ms - ${getReactionRating(reactionTime)}`;

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <button
          onClick={handleClick}
          className={`${bgColor} text-white rounded-xl p-12 text-center cursor-pointer transition-colors select-none min-h-[200px] flex flex-col items-center justify-center`}
        >
          <div className="text-2xl font-bold">{message}</div>
          {state === 'result' && <div className="text-lg mt-2">Click to try again</div>}
        </button>
        {history.length > 0 && (
          <div className="flex gap-6 justify-center text-center">
            <div><p className="text-sm text-gray-500">Attempts</p><p className="text-xl font-bold">{history.length}</p></div>
            <div><p className="text-sm text-gray-500">Average</p><p className="text-xl font-bold">{avg}ms</p></div>
            <div><p className="text-sm text-gray-500">Best</p><p className="text-xl font-bold text-green-600">{best}ms</p></div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
