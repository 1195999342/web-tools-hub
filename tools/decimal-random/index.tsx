'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import CopyButton from '../../components/ui/CopyButton';
import { generateRandom } from './logic';
import type { ToolMeta } from '../registry';

export default function DecimalRandomTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.decimal-random');
  const [min, setMin] = useState('0');
  const [max, setMax] = useState('100');
  const [decimals, setDecimals] = useState('2');
  const [count, setCount] = useState('10');
  const [results, setResults] = useState<string[]>([]);

  function handleGenerate() {
    const lo = parseFloat(min), hi = parseFloat(max), dp = parseInt(decimals), n = parseInt(count);
    if (isNaN(lo) || isNaN(hi) || isNaN(dp) || isNaN(n) || lo >= hi || n < 1 || n > 10000) return;
    setResults(generateRandom(lo, hi, dp, n));
  }

  const output = results.join('\n');

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <Input label="Min" type="number" value={min} onChange={e => setMin(e.target.value)} />
          <Input label="Max" type="number" value={max} onChange={e => setMax(e.target.value)} />
          <Input label="Decimal places" type="number" min={0} max={10} value={decimals} onChange={e => setDecimals(e.target.value)} />
          <Input label="Count" type="number" min={1} max={10000} value={count} onChange={e => setCount(e.target.value)} />
        </div>
        <Button onClick={handleGenerate}>Generate</Button>
        {results.length > 0 && (
          <div className="relative">
            <pre className="rounded-md border border-gray-200 bg-gray-50 p-4 overflow-auto text-sm text-gray-900 whitespace-pre-wrap max-h-64">
              {output}
            </pre>
            <p className="text-xs text-gray-500 mt-1">{results.length} numbers generated</p>
            <div className="mt-2 flex justify-end"><CopyButton text={output} /></div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
