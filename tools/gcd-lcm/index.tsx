'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Textarea from '../../components/ui/Textarea';
import Button from '../../components/ui/Button';
import { gcd, lcm } from './logic';
import type { ToolMeta } from '../registry';

export default function GcdLcmTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.gcd-lcm');
  const [input, setInput] = useState('12, 18, 24');
  const [result, setResult] = useState<{ gcd: number; lcm: number } | null>(null);
  const [error, setError] = useState('');

  function handleCalc() {
    setError('');
    const nums = input.split(/[,\s\n]+/).map(s => parseInt(s.trim())).filter(n => !isNaN(n));
    if (nums.length < 2) { setError('Enter at least 2 numbers'); return; }
    setResult({ gcd: gcd(nums), lcm: lcm(nums) });
  }

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <Textarea label="Numbers (comma or space separated)" value={input} onChange={e => setInput(e.target.value)} rows={3} placeholder="12, 18, 24" />
        <Button onClick={handleCalc}>Calculate</Button>
        {error && <p className="text-sm text-red-600">{error}</p>}
        {result && (
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-md border border-gray-200 bg-gray-50 p-4 text-center">
              <p className="text-sm text-gray-500">GCD</p>
              <p className="text-2xl font-bold text-gray-900">{result.gcd}</p>
            </div>
            <div className="rounded-md border border-gray-200 bg-gray-50 p-4 text-center">
              <p className="text-sm text-gray-500">LCM</p>
              <p className="text-2xl font-bold text-gray-900">{result.lcm}</p>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
