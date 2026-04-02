'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Input from '../../components/ui/Input';
import CopyButton from '../../components/ui/CopyButton';
import type { ToolMeta } from '../registry';
import { numberToChinese, numberToUpperChinese } from './logic';

export default function NumberToChineseTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.number-to-chinese');
  const [input, setInput] = useState('');
  const num = parseFloat(input);
  const normal = !isNaN(num) ? numberToChinese(num) : '';
  const upper = !isNaN(num) ? numberToUpperChinese(num) : '';

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <Input label={t('input_label')} type="number" value={input} onChange={e => setInput(e.target.value)} placeholder={t('input_placeholder')} />
        {normal && (
          <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
            <p className="text-sm text-gray-500 mb-1">{t('normal_label')}</p>
            <p className="text-lg text-gray-900">{normal}</p>
            <div className="mt-2 flex justify-end"><CopyButton text={normal} /></div>
          </div>
        )}
        {upper && (
          <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
            <p className="text-sm text-gray-500 mb-1">{t('upper_label')}</p>
            <p className="text-lg text-gray-900">{upper}</p>
            <div className="mt-2 flex justify-end"><CopyButton text={upper} /></div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
