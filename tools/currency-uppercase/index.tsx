'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Input from '../../components/ui/Input';
import CopyButton from '../../components/ui/CopyButton';
import type { ToolMeta } from '../registry';
import { numberToCurrencyCN, numberToUppercaseEN } from './logic';

export default function CurrencyUppercaseTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.currency-uppercase');
  const [input, setInput] = useState('');
  const num = parseFloat(input) || 0;
  const cn = numberToCurrencyCN(num);
  const en = numberToUppercaseEN(num);
  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <Input label={t('number_label')} type="number" value={input} onChange={e => setInput(e.target.value)} placeholder="0.00" />
        {input && (
          <div className="space-y-3">
            <div className="flex flex-col gap-1"><span className="text-sm font-medium">中文大写</span><div className="flex items-center gap-2"><code className="flex-1 rounded border bg-gray-50 p-2 text-sm">{cn}</code><CopyButton text={cn} /></div></div>
            <div className="flex flex-col gap-1"><span className="text-sm font-medium">English</span><div className="flex items-center gap-2"><code className="flex-1 rounded border bg-gray-50 p-2 text-sm">{en}</code><CopyButton text={en} /></div></div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
