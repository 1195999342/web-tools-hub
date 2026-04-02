'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Textarea from '../../components/ui/Textarea';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import CopyButton from '../../components/ui/CopyButton';
import type { ToolMeta } from '../registry';
import { csvToJson } from './logic';

export default function CsvToJsonTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.csv-to-json');
  const [input, setInput] = useState('');
  const [delimiter, setDelimiter] = useState(',');
  const [output, setOutput] = useState('');

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <Textarea value={input} onChange={e => setInput(e.target.value)} placeholder={t('input_placeholder')} rows={8} />
        <Input label={t('delimiter_label')} value={delimiter} onChange={e => setDelimiter(e.target.value)} />
        <Button onClick={() => setOutput(csvToJson(input, delimiter))}>{t('convert_button')}</Button>
        {output && (
          <div className="relative">
            <pre className="rounded-md border border-gray-200 bg-gray-50 p-4 text-sm text-gray-900 whitespace-pre-wrap overflow-auto max-h-96">{output}</pre>
            <div className="mt-2 flex justify-end"><CopyButton text={output} /></div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
