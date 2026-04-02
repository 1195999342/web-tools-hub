'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Textarea from '../../components/ui/Textarea';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import CopyButton from '../../components/ui/CopyButton';
import { sortJsonKeys, type SortOrder } from './logic';
import type { ToolMeta } from '../../tools/registry';

interface Props { locale: string; toolMeta: ToolMeta; }

export default function JsonSortTool({ locale, toolMeta }: Props) {
  const t = useTranslations('tools.json-sort');
  const [input, setInput] = useState('');
  const [order, setOrder] = useState<SortOrder>('asc');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const orderOptions = [
    { value: 'asc', label: t('order_asc') },
    { value: 'desc', label: t('order_desc') },
  ];

  function handleSort() {
    setError('');
    setOutput('');
    const result = sortJsonKeys(input, order);
    if (result.error) setError(result.error);
    else setOutput(result.output ?? '');
  }

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('input_placeholder')}
          rows={8}
        />
        <div className="flex items-end gap-4">
          <div className="w-40">
            <Select
              label={t('order_label')}
              options={orderOptions}
              value={order}
              onChange={(e) => setOrder(e.target.value as SortOrder)}
            />
          </div>
          <Button onClick={handleSort}>{t('sort_button')}</Button>
        </div>
        {error && <p className="text-sm text-red-600" role="alert">{t('error_invalid_json')}</p>}
        {output && (
          <div className="relative">
            <pre className="rounded-md border border-gray-200 bg-gray-50 p-4 overflow-auto text-sm text-gray-900 whitespace-pre-wrap break-all">
              <code>{output}</code>
            </pre>
            <div className="mt-2 flex justify-end">
              <CopyButton text={output} />
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
