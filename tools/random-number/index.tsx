'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import CopyButton from '../../components/ui/CopyButton';
import Toggle from '../../components/ui/Toggle';
import { generateRandomIntegers, generateRandomFloats } from './logic';
import type { ToolMeta } from '../../tools/registry';

export default function RandomNumberTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.random-number');
  const [min, setMin] = useState('1');
  const [max, setMax] = useState('100');
  const [count, setCount] = useState('10');
  const [isFloat, setIsFloat] = useState(false);
  const [results, setResults] = useState<number[]>([]);
  const [error, setError] = useState('');

  function handleGenerate() {
    setError('');
    const minN = parseFloat(min);
    const maxN = parseFloat(max);
    const countN = parseInt(count);
    const result = isFloat
      ? generateRandomFloats(minN, maxN, countN)
      : generateRandomIntegers(Math.floor(minN), Math.floor(maxN), countN);
    if (result.error) setError(result.error);
    else setResults(result.output ?? []);
  }

  const outputText = results.join('\n');

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-3 gap-4">
          <Input label={t('min_label')} type="number" value={min} onChange={(e) => setMin(e.target.value)} />
          <Input label={t('max_label')} type="number" value={max} onChange={(e) => setMax(e.target.value)} />
          <Input label={t('count_label')} type="number" value={count} onChange={(e) => setCount(e.target.value)} />
        </div>
        <div className="flex items-center gap-4">
          <Toggle label={t('float_label')} checked={isFloat} onChange={setIsFloat} />
          <Button onClick={handleGenerate}>{t('generate_button')}</Button>
        </div>
        {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
        {results.length > 0 && (
          <div className="relative">
            <pre className="rounded-md border border-gray-200 bg-gray-50 p-4 overflow-auto text-sm text-gray-900 whitespace-pre-wrap"><code>{outputText}</code></pre>
            <div className="mt-2 flex justify-end"><CopyButton text={outputText} /></div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
