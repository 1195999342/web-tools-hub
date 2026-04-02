'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { convert, getUnits, getCategories, type UnitCategory } from './logic';
import type { ToolMeta } from '../../tools/registry';

export default function UnitConverterTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.unit-converter');
  const [category, setCategory] = useState<UnitCategory>('length');
  const [fromUnit, setFromUnit] = useState('m');
  const [toUnit, setToUnit] = useState('km');
  const [value, setValue] = useState('1');

  const units = getUnits(category);
  const numValue = parseFloat(value) || 0;
  const result = convert(numValue, fromUnit, toUnit, category);

  function handleCategoryChange(cat: UnitCategory) {
    setCategory(cat);
    const u = getUnits(cat);
    setFromUnit(u[0]?.value ?? '');
    setToUnit(u[1]?.value ?? u[0]?.value ?? '');
  }

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <Select label={t('category_label')} value={category} onChange={(e) => handleCategoryChange(e.target.value as UnitCategory)}
          options={getCategories().map((c) => ({ value: c.value, label: c.label }))} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <Input label={t('value_label')} type="number" value={value} onChange={(e) => setValue(e.target.value)} />
          <Select label={t('from_label')} value={fromUnit} onChange={(e) => setFromUnit(e.target.value)} options={units} />
          <Select label={t('to_label')} value={toUnit} onChange={(e) => setToUnit(e.target.value)} options={units} />
        </div>
        <div className="rounded-md border border-gray-200 bg-gray-50 p-4 text-center">
          <span className="text-2xl font-bold text-gray-900">
            {result.output !== undefined ? parseFloat(result.output.toPrecision(10)) : '—'}
          </span>
        </div>
        {result.error && <p className="text-sm text-red-600" role="alert">{result.error}</p>}
      </div>
    </ToolLayout>
  );
}
