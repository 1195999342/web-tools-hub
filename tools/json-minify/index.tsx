'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Textarea from '../../components/ui/Textarea';
import Button from '../../components/ui/Button';
import CopyButton from '../../components/ui/CopyButton';
import { minifyJson, escapeJson, unescapeJson } from './logic';
import type { ToolMeta } from '../../tools/registry';

interface JsonMinifyProps {
  locale: string;
  toolMeta: ToolMeta;
}

export default function JsonMinifyTool({ locale, toolMeta }: JsonMinifyProps) {
  const t = useTranslations('tools.json-minify');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  function handleAction(action: 'minify' | 'escape' | 'unescape') {
    setError('');
    setOutput('');
    const fn = action === 'minify' ? minifyJson : action === 'escape' ? escapeJson : unescapeJson;
    const result = fn(input);
    if (result.error) setError(t('error_invalid_json'));
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

        <div className="flex flex-wrap gap-2">
          <Button onClick={() => handleAction('minify')}>{t('minify_button')}</Button>
          <Button variant="secondary" onClick={() => handleAction('escape')}>{t('escape_button')}</Button>
          <Button variant="secondary" onClick={() => handleAction('unescape')}>{t('unescape_button')}</Button>
        </div>

        {error && (
          <p className="text-sm text-red-600" role="alert">{error}</p>
        )}

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
