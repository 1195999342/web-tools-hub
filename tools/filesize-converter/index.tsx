'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { convertFilesize, getUnits } from './logic';
import type { ToolMeta } from '../../tools/registry';

export default function FilesizeConverterTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.filesize-converter');
  const [value, setValue] = useState('1');
  const [unit, setUnit] = useState('MB');

  const allUnits = [...getUnits().decimal, ...getUnits().binary.filter(u => u !== 'B')];
  const numValue = parseFloat(value) || 0;
  const result = convertFilesize(numValue, unit);

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <Input label={t('value_label')} type="number" value={value} onChange={(e) => setValue(e.target.value)} />
          <Select label={t('unit_label')} value={unit} onChange={(e) => setUnit(e.target.value)}
            options={allUnits.map((u) => ({ value: u, label: u }))} />
        </div>
        {result.output && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">{t('decimal_label')}</h3>
              {Object.entries(result.output.decimal).map(([u, v]) => (
                <div key={u} className="flex justify-between text-sm py-1">
                  <span className="text-gray-600">{u}</span>
                  <span className="font-mono text-gray-900">{v}</span>
                </div>
              ))}
            </div>
            <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">{t('binary_label')}</h3>
              {Object.entries(result.output.binary).map(([u, v]) => (
                <div key={u} className="flex justify-between text-sm py-1">
                  <span className="text-gray-600">{u}</span>
                  <span className="font-mono text-gray-900">{v}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {result.error && <p className="text-sm text-red-600" role="alert">{result.error}</p>}
      </div>
    </ToolLayout>
  );
}
