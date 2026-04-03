'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { calcPartitionMB } from './logic';
import type { ToolMeta } from '../registry';

export default function DiskPartitionTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.disk-partition');
  const [gb, setGb] = useState('100');
  const [result, setResult] = useState<number | null>(null);

  function handleCalc() {
    const n = parseFloat(gb);
    if (isNaN(n) || n <= 0) return;
    setResult(calcPartitionMB(n));
  }

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <div className="flex gap-3 items-end">
          <Input label="Desired display size (GB)" type="number" value={gb} onChange={e => setGb(e.target.value)} />
          <Button onClick={handleCalc}>Calculate</Button>
        </div>
        {result !== null && (
          <div className="rounded-md border border-gray-200 bg-gray-50 p-4 text-center">
            <p className="text-sm text-gray-500">Set partition size to</p>
            <p className="text-3xl font-bold text-gray-900">{result.toLocaleString()} MB</p>
            <p className="text-sm text-gray-500 mt-1">Windows will display this as {gb} GB</p>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
