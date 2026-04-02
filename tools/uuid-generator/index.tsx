'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import Input from '../../components/ui/Input';
import CopyButton from '../../components/ui/CopyButton';
import { generateBatch, type UuidFormat } from './logic';
import type { ToolMeta } from '../../tools/registry';

interface Props { locale: string; toolMeta: ToolMeta; }

export default function UuidGeneratorTool({ locale, toolMeta }: Props) {
  const t = useTranslations('tools.uuid-generator');
  const [quantity, setQuantity] = useState(1);
  const [format, setFormat] = useState<UuidFormat>('standard');
  const [results, setResults] = useState<string[]>([]);

  const formatOptions = [
    { value: 'standard', label: t('format_standard') },
    { value: 'no-dash', label: t('format_no_dash') },
    { value: 'uppercase', label: t('format_uppercase') },
    { value: 'lowercase', label: t('format_lowercase') },
  ];

  function handleGenerate() {
    setResults(generateBatch(quantity, format));
  }

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-end gap-4">
          <div className="w-32">
            <Input
              label={t('quantity_label')}
              type="number"
              min={1}
              max={1000}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Math.min(1000, Number(e.target.value))))}
            />
          </div>
          <div className="w-48">
            <Select
              label={t('format_label')}
              options={formatOptions}
              value={format}
              onChange={(e) => setFormat(e.target.value as UuidFormat)}
            />
          </div>
          <Button onClick={handleGenerate}>{t('generate_button')}</Button>
        </div>
        {results.length > 0 && (
          <div className="relative">
            <pre className="rounded-md border border-gray-200 bg-gray-50 p-4 overflow-auto text-sm text-gray-900 whitespace-pre-wrap break-all max-h-96">
              <code>{results.join('\n')}</code>
            </pre>
            <div className="mt-2 flex justify-end">
              <CopyButton text={results.join('\n')} />
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
