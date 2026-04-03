'use client';
import { useState, useRef, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Textarea from '../../components/ui/Textarea';
import Button from '../../components/ui/Button';
import type { ToolMeta } from '../registry';
import { parseNames, pickRandom } from './logic';

export default function RandomPickerTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.random-picker');
  const [input, setInput] = useState('Alice\nBob\nCharlie\nDiana\nEve\nFrank');
  const [rolling, setRolling] = useState('');
  const [result, setResult] = useState('');
  const [isRolling, setIsRolling] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null as any);

  const handlePick = useCallback(() => {
    const names = parseNames(input);
    if (names.length === 0) return;
    setIsRolling(true);
    setResult('');
    let count = 0;
    const maxCount = 20;
    const roll = () => {
      setRolling(names[Math.floor(Math.random() * names.length)]);
      count++;
      if (count < maxCount) {
        timerRef.current = setTimeout(roll, 50 + count * 15);
      } else {
        const winner = pickRandom(names)!;
        setRolling('');
        setResult(winner);
        setIsRolling(false);
      }
    };
    roll();
  }, [input]);

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <Textarea label="Names (one per line)" value={input} onChange={e => setInput(e.target.value)} rows={6} />
        <Button onClick={handlePick} disabled={isRolling}>
          {isRolling ? '🎲 Rolling...' : '🎲 Pick a Name!'}
        </Button>
        {(rolling || result) && (
          <div className="flex flex-col items-center py-8">
            {rolling && (
              <div className="text-3xl font-bold text-blue-500 animate-pulse">{rolling}</div>
            )}
            {result && (
              <div className="flex flex-col items-center gap-2">
                <span className="text-5xl">🎉</span>
                <div className="text-4xl font-bold text-green-600">{result}</div>
              </div>
            )}
          </div>
        )}
        <div className="text-sm text-gray-400 text-center">
          {parseNames(input).length} names in the pool
        </div>
      </div>
    </ToolLayout>
  );
}
