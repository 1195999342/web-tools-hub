'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import CopyButton from '../../components/ui/CopyButton';
import { convertRadix, type Radix } from './logic';
import type { ToolMeta } from '../../tools/registry';

interface Props { locale: string; toolMeta: ToolMeta; }

export default function RadixConverterTool({ locale, toolMeta }: Props) {
  const t = useTranslations('tools.radix-converter');
  const [input, setInput] = useState('');
  const [fromRadix, setFromRadix] = useState<Radix>(10);

  const radixOptions = [
    { value: '2', label: t('binary') },
    { value: '8', label: t('octal') },
    { value: '10', label: t('decimal') },
    { value: '16', label: t('hex') },
  ];

  const result = useMemo(() => convertRadix(input, fromRadix), [input, fromRadix]);

  const outputs = [
    { label: t('binary'), value: result.binary, prefix: 'BIN' },
    { label: t('octal'), value: result.octal, prefix: 'OCT' },
    { label: t('decimal'), value: result.decimal, prefix: 'DEC' },
    { label: t('hex'), value: result.hex, prefix: 'HEX' },
  ];

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[200px]">
            <Input
              label={t('input_label')}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t('input_placeholder')}
            />
          </div>
          <div className="w-40">
            <Select
              label={t('source_radix')}
              options={radixOptions}
              value={String(fromRadix)}
              onChange={(e) => setFromRadix(Number(e.target.value) as Radix)}
            />
          </div>
        </div>
        {result.error && <p className="text-sm text-red-600" role="alert">{t('error_invalid')}</p>}
        <div className="flex flex-col gap-3">
          {outputs.map((o) => (
            <div key={o.prefix} className="flex items-center justify-between rounded-md border border-gray-200 bg-gray-50 p-3">
              <div>
                <span className="text-xs font-semibold text-gray-500">{o.prefix}</span>
                <div className="text-sm font-mono text-gray-900">{o.value || '—'}</div>
              </div>
              {o.value && <CopyButton text={o.value} />}
            </div>
          ))}
        </div>
      </div>
    </ToolLayout>
  );
}
