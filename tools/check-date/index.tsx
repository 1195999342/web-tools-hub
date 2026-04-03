'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import CopyButton from '../../components/ui/CopyButton';
import { toChineseUpperDate } from './logic';
import type { ToolMeta } from '../registry';

export default function CheckDateTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.check-date');
  const [dateStr, setDateStr] = useState(new Date().toISOString().slice(0, 10));
  const [result, setResult] = useState('');

  function handleConvert() {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return;
    setResult(toChineseUpperDate(d));
  }

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <div className="flex gap-3 items-end">
          <Input label="Date" type="date" value={dateStr} onChange={e => setDateStr(e.target.value)} />
          <Button onClick={handleConvert}>Convert</Button>
        </div>
        {result && (
          <div className="relative">
            <div className="rounded-md border border-gray-200 bg-gray-50 p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">{result}</p>
            </div>
            <div className="mt-2 flex justify-end"><CopyButton text={result} /></div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
