'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Select from '../../components/ui/Select';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import CopyButton from '../../components/ui/CopyButton';
import { generateBatch, type MacFormat } from './logic';
import type { ToolMeta } from '../registry';

export default function MacGenTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.mac-gen');
  const [format, setFormat] = useState<MacFormat>('colon');
  const [count, setCount] = useState(1);
  const [results, setResults] = useState<string[]>([]);

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <Select label="Format" options={[{ value: 'colon', label: 'Colon (AA:BB:CC)' }, { value: 'dash', label: 'Dash (AA-BB-CC)' }, { value: 'none', label: 'None (AABBCC)' }]} value={format} onChange={e => setFormat(e.target.value as MacFormat)} />
          <Input label="Count" type="number" min={1} max={100} value={count} onChange={e => setCount(Number(e.target.value))} />
        </div>
        <Button onClick={() => setResults(generateBatch(count, format))}>Generate</Button>
        {results.length > 0 && (
          <div className="relative">
            <pre className="rounded-md border border-gray-200 bg-gray-50 p-4 text-sm font-mono whitespace-pre-wrap">{results.join('\n')}</pre>
            <div className="mt-2 flex justify-end"><CopyButton text={results.join('\n')} /></div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
