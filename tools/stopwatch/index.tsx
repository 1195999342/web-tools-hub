'use client';
import { useState, useRef, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Button from '../../components/ui/Button';
import { formatTime } from './logic';
import type { ToolMeta } from '../registry';

export default function StopwatchTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.stopwatch');
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startRef = useRef(0);

  const start = useCallback(() => {
    startRef.current = Date.now() - elapsed;
    intervalRef.current = setInterval(() => {
      setElapsed(Date.now() - startRef.current);
    }, 10);
    setRunning(true);
  }, [elapsed]);

  const stop = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setRunning(false);
  }, []);

  const reset = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setRunning(false);
    setElapsed(0);
    setLaps([]);
  }, []);

  const lap = useCallback(() => {
    setLaps(prev => [...prev, elapsed]);
  }, [elapsed]);

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col items-center gap-6">
        <div className="text-6xl font-mono font-bold text-gray-900 tabular-nums">
          {formatTime(elapsed)}
        </div>
        <div className="flex gap-3">
          {!running ? (
            <Button onClick={start}>Start</Button>
          ) : (
            <Button onClick={stop} variant="secondary">Stop</Button>
          )}
          <Button onClick={lap} variant="secondary" disabled={!running}>Lap</Button>
          <Button onClick={reset} variant="ghost">Reset</Button>
        </div>
        {laps.length > 0 && (
          <div className="w-full max-w-sm">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Laps</h3>
            <div className="rounded-md border border-gray-200 divide-y divide-gray-100">
              {laps.map((l, i) => (
                <div key={i} className="flex justify-between px-4 py-2 text-sm">
                  <span className="text-gray-500">Lap {i + 1}</span>
                  <span className="font-mono text-gray-900">{formatTime(l)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
