'use client';
import { useState, useRef, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Button from '../../components/ui/Button';
import { runBatch, estimatePi } from './logic';
import type { ToolMeta } from '../registry';

export default function MonteCarloPiTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.monte-carlo-pi');
  const [running, setRunning] = useState(false);
  const [inside, setInside] = useState(0);
  const [total, setTotal] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = useCallback(() => {
    setRunning(true);
    intervalRef.current = setInterval(() => {
      const batch = runBatch(1000);
      setInside(prev => prev + batch.inside);
      setTotal(prev => prev + batch.total);
    }, 50);
  }, []);

  const stop = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setRunning(false);
  }, []);

  const reset = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setRunning(false);
    setInside(0);
    setTotal(0);
  }, []);

  const piEstimate = total > 0 ? estimatePi(inside, total) : 0;

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col items-center gap-6">
        <div className="text-center">
          <p className="text-sm text-gray-500">Estimated π</p>
          <p className="text-5xl font-mono font-bold text-gray-900 tabular-nums">{total > 0 ? piEstimate.toFixed(8) : '—'}</p>
        </div>
        <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
          <div className="rounded-md border border-gray-200 bg-gray-50 p-3 text-center">
            <p className="text-xs text-gray-500">Points inside</p>
            <p className="text-lg font-semibold text-green-600">{inside.toLocaleString()}</p>
          </div>
          <div className="rounded-md border border-gray-200 bg-gray-50 p-3 text-center">
            <p className="text-xs text-gray-500">Total points</p>
            <p className="text-lg font-semibold text-gray-900">{total.toLocaleString()}</p>
          </div>
        </div>
        <div className="flex gap-3">
          {!running ? (
            <Button onClick={start}>Start</Button>
          ) : (
            <Button onClick={stop} variant="secondary">Stop</Button>
          )}
          <Button onClick={reset} variant="ghost">Reset</Button>
        </div>
        <p className="text-xs text-gray-400">Actual π = 3.14159265...</p>
      </div>
    </ToolLayout>
  );
}
