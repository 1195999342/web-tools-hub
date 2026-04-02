'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import type { ToolMeta } from '../registry';
import { convert, UNITS, type CSSUnit } from './logic';

export default function PxConverterTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.px-converter');
  const [value, setValue] = useState('16');
  const [from, setFrom] = useState<CSSUnit>('px');
  const [baseFontSize, setBaseFontSize] = useState('16');
  const num = parseFloat(value) || 0;
  const base = parseFloat(baseFontSize) || 16;

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <Input label={t('value_label')} type="number" value={value} onChange={e => setValue(e.target.value)} />
          <Select label={t('unit_label')} options={UNITS.map(u => ({ value: u, label: u }))} value={from} onChange={e => setFrom(e.target.value as CSSUnit)} />
        </div>
        <Input label={t('base_font_label')} type="number" value={baseFontSize} onChange={e => setBaseFontSize(e.target.value)} />
        <div className="grid grid-cols-2 gap-3">
          {UNITS.filter(u => u !== from).map(u => (
            <div key={u} className="rounded-md border border-gray-200 bg-gray-50 p-3">
              <span className="text-sm text-gray-500">{u}</span>
              <p className="text-lg font-mono font-bold text-gray-900">{convert(num, from, u, base)}</p>
            </div>
          ))}
        </div>
      </div>
    </ToolLayout>
  );
}
