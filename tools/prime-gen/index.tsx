'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import CopyButton from '../../components/ui/CopyButton';
import { generatePrimes } from './logic';
import type { ToolMeta } from '../registry';

export default function PrimeGenTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.prime-gen');
  const [start, setStart] = useState('2');
  const [end, setEnd] = useState('100');
  const [primes, setPrimes] = useState<number[]>([]);

  function handleGenerate() {
    const s = parseInt(start), e = parseInt(end);
    if (isNaN(s) || isNaN(e) || e > 1000000) return;
    setPrimes(generatePrimes(s, e));
  }

  const output = primes.join(', ');

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <div className="flex gap-3 items-end">
          <Input label="Start" type="number" min={2} value={start} onChange={e => setStart(e.target.value)} />
          <Input label="End" type="number" value={end} onChange={e => setEnd(e.target.value)} />
          <Button onClick={handleGenerate}>Generate</Button>
        </div>
        {primes.length > 0 && (
          <div className="relative">
            <p className="text-sm text-gray-600 mb-2">Found {primes.length} primes</p>
            <pre className="rounded-md border border-gray-200 bg-gray-50 p-4 overflow-auto text-sm text-gray-900 whitespace-pre-wrap break-all max-h-64">
              {output}
            </pre>
            <div className="mt-2 flex justify-end">
              <CopyButton text={output} />
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
