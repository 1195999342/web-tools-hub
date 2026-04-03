'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { getShichen, getAllShichen } from './logic';
import type { ShichenResult } from './logic';
import type { ToolMeta } from '../registry';

export default function ShichenTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.shichen');
  const [time, setTime] = useState('12:00');
  const [result, setResult] = useState<ShichenResult | null>(null);

  function handleConvert() {
    const [h] = time.split(':').map(Number);
    if (isNaN(h) || h < 0 || h > 23) return;
    setResult(getShichen(h));
  }

  const all = getAllShichen();

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <div className="flex gap-3 items-end">
          <Input label="Time (HH:MM)" type="time" value={time} onChange={e => setTime(e.target.value)} />
          <Button onClick={handleConvert}>Convert</Button>
        </div>
        {result && (
          <div className="rounded-md border border-gray-200 bg-gray-50 p-4 text-center">
            <p className="text-3xl font-bold text-gray-900">{result.name}</p>
            <p className="text-sm text-gray-500 mt-1">{result.range}</p>
          </div>
        )}
        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">All Shichen</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {all.map(s => (
              <div key={s.branch} className="rounded border border-gray-100 bg-white p-2 text-center text-sm">
                <p className="font-medium text-gray-900">{s.name}</p>
                <p className="text-xs text-gray-500">{s.range}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
