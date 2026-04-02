'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Textarea from '../../components/ui/Textarea';
import Button from '../../components/ui/Button';
import CopyButton from '../../components/ui/CopyButton';
import { generateSchema } from './logic';
import type { ToolMeta } from '../../tools/registry';

interface Props { locale: string; toolMeta: ToolMeta; }

export default function JsonSchemaTool({ locale, toolMeta }: Props) {
  const t = useTranslations('tools.json-schema');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  function handleGenerate() {
    setError('');
    setOutput('');
    const result = generateSchema(input);
    if (result.error) setError(result.error);
    else setOutput(result.output ?? '');
  }

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <Textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder={t('input_placeholder')} rows={8} />
        <Button onClick={handleGenerate}>{t('generate_button')}</Button>

        {error && <p className="text-sm text-red-600" role="alert">{error}</p>}

        {output && (
          <div className="relative">
            <pre className="rounded-md border border-gray-200 bg-gray-50 p-4 overflow-auto text-sm text-gray-900 whitespace-pre-wrap break-all">
              <code>{output}</code>
            </pre>
            <div className="mt-2 flex justify-end"><CopyButton text={output} /></div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
