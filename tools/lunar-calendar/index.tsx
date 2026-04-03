'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import CopyButton from '../../components/ui/CopyButton';
import type { ToolMeta } from '../registry';
import { solarToLunar } from './logic';

export default function LunarCalendarTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.lunar-calendar');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [result, setResult] = useState('');
  const handleConvert = () => { const [y, m, d] = date.split('-').map(Number); setResult(solarToLunar(y, m, d)); };
  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <Input label={t('date_label')} type="date" value={date} onChange={e => setDate(e.target.value)} />
        <Button onClick={handleConvert}>{t('convert_button')}</Button>
        {result && <div className="flex items-center gap-2"><code className="flex-1 rounded border bg-gray-50 p-3 text-lg">{result}</code><CopyButton text={result} /></div>}
      </div>
    </ToolLayout>
  );
}
