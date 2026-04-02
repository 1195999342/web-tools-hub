'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import CodeEditor from '../../components/ui/CodeEditor';
import Button from '../../components/ui/Button';
import CopyButton from '../../components/ui/CopyButton';
import { beautifyJs, minifyJs } from './logic';
import type { ToolMeta } from '../../tools/registry';

export default function JsFormatterTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.js-formatter');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  function handleBeautify() {
    setError('');
    const result = beautifyJs(input);
    if (result.error) setError(result.error);
    else setOutput(result.output ?? '');
  }

  function handleMinify() {
    setError('');
    const result = minifyJs(input);
    if (result.error) setError(result.error);
    else setOutput(result.output ?? '');
  }

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <CodeEditor value={input} onChange={setInput} placeholder={t('input_placeholder')} rows={10} label={t('input_label')} />
        <div className="flex gap-3">
          <Button onClick={handleBeautify}>{t('beautify_button')}</Button>
          <Button variant="secondary" onClick={handleMinify}>{t('minify_button')}</Button>
        </div>
        {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
        {output && (
          <div className="relative">
            <CodeEditor value={output} readOnly rows={10} label={t('output_label')} />
            <div className="mt-2 flex justify-end"><CopyButton text={output} /></div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
