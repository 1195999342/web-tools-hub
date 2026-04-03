'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Textarea from '../../components/ui/Textarea';
import type { ToolMeta } from '../registry';
import { sumNumbers } from './logic';

export default function NumberSumTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.number-sum');
  const [input, setInput] = useState('');
  const { sum, count } = sumNumbers(input);
  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <Textarea value={input} onChange={e => setInput(e.target.value)} placeholder={t('input_placeholder')} rows={8} />
        {input && <div className="flex gap-6"><div className="text-center"><p className="text-sm text-gray-500">{t('sum_label')}</p><p className="text-2xl font-bold">{sum}</p></div><div className="text-center"><p className="text-sm text-gray-500">{t('count_label')}</p><p className="text-2xl font-bold">{count}</p></div></div>}
      </div>
    </ToolLayout>
  );
}
