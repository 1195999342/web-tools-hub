'use client';
import { useState, useRef, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { formatCountdown } from './logic';
import type { ToolMeta } from '../registry';

export default function MeetingTimerTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.meeting-timer');
  const [minutes, setMinutes] = useState('5');
  const [remaining, setRemaining] = useState<number | null>(null);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const endRef = useRef(0);

  const start = useCallback(() => {
    const m = parseInt(minutes);
    if (isNaN(m) || m <= 0) return;
    const totalSec = m * 60;
    endRef.current = Date.now() + totalSec * 1000;
    setRemaining(totalSec);
    setRunning(true);
    intervalRef.current = setInterval(() => {
      const left = Math.ceil((endRef.current - Date.now()) / 1000);
      setRemaining(left);
      if (left <= 0 && intervalRef.current) {
        clearInterval(intervalRef.current);
        setRunning(false);
      }
    }, 200);
  }, [minutes]);

  const stop = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setRunning(false);
  }, []);

  const reset = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setRunning(false);
    setRemaining(null);
  }, []);

  const isTimeUp = remaining !== null && remaining <= 0;

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col items-center gap-6">
        {remaining === null && (
          <div className="flex gap-3 items-end">
            <Input label="Minutes" type="number" min={1} max={999} value={minutes} onChange={e => setMinutes(e.target.value)} />
            <Button onClick={start}>Start</Button>
          </div>
        )}
        {remaining !== null && (
          <>
            <div className={`text-7xl font-mono font-bold tabular-nums px-8 py-6 rounded-lg transition-colors ${isTimeUp ? 'bg-red-100 text-red-600' : 'bg-gray-50 text-gray-900'}`}>
              {formatCountdown(Math.max(0, remaining))}
            </div>
            {isTimeUp && <p className="text-xl font-semibold text-red-600">Time&apos;s up!</p>}
            <div className="flex gap-3">
              {running ? (
                <Button onClick={stop} variant="secondary">Pause</Button>
              ) : !isTimeUp ? (
                <Button onClick={() => {
                  endRef.current = Date.now() + (remaining ?? 0) * 1000;
                  setRunning(true);
                  intervalRef.current = setInterval(() => {
                    const left = Math.ceil((endRef.current - Date.now()) / 1000);
                    setRemaining(left);
                    if (left <= 0 && intervalRef.current) { clearInterval(intervalRef.current); setRunning(false); }
                  }, 200);
                }}>Resume</Button>
              ) : null}
              <Button onClick={reset} variant="ghost">Reset</Button>
            </div>
          </>
        )}
      </div>
    </ToolLayout>
  );
}
