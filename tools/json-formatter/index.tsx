'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Textarea from '../../components/ui/Textarea';
import Button from '../../components/ui/Button';
import CopyButton from '../../components/ui/CopyButton';
import type { ToolMeta } from '../../tools/registry';

export interface FormatResult {
  output?: string;
  error?: string;
}

export function formatJson(input: string): FormatResult {
  if (input.trim() === '') {
    return { output: '' };
  }
  try {
    const parsed = JSON.parse(input);
    return { output: JSON.stringify(parsed, null, 2) };
  } catch (e) {
    return { error: (e as Error).message };
  }
}

interface JsonFormatterProps {
  locale: string;
  toolMeta: ToolMeta;
}

export default function JsonFormatter({ locale, toolMeta }: JsonFormatterProps) {
  const t = useTranslations('tools.json-formatter');
  const [input, setInput] = useState('');
  const [result, setResult] = useState<FormatResult>({});

  function handleFormat() {
    setResult(formatJson(input));
  }

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('input_placeholder')}
          rows={10}
        />

        <div>
          <Button onClick={handleFormat}>{t('format_button')}</Button>
        </div>

        {result.error && (
          <p className="text-sm text-red-600" role="alert">
            {t('error_invalid_json', { message: result.error })}
          </p>
        )}

        {result.output !== undefined && result.output !== '' && (
          <div className="relative">
            <pre className="rounded-md border border-gray-200 bg-gray-50 p-4 overflow-auto text-sm text-gray-900">
              <code>{result.output}</code>
            </pre>
            <div className="mt-2 flex justify-end">
              <CopyButton text={result.output} />
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
