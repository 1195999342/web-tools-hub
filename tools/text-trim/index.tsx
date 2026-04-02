'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Textarea from '../../components/ui/Textarea';
import Button from '../../components/ui/Button';
import CopyButton from '../../components/ui/CopyButton';
import Select from '../../components/ui/Select';
import { trimText, type TrimMode } from './logic';
import type { ToolMeta } from '../../tools/registry';

export default function TextTrimTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.text-trim');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<TrimMode>('remove-empty');
  const [error, setError] = useState('');

  function handleTrim() {
    setError('');
    const result = trimText(input, mode);
    if (result.error) setError(result.error);
    else setOutput(result.output ?? '');
  }

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <Textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder={t('input_placeholder')} rows={8} />
        <div className="flex items-center gap-4 flex-wrap">
          <Select label={t('mode_label')} value={mode} onChange={(e) => setMode(e.target.value as TrimMode)} options={[
            { value: 'remove-empty', label: t('mode_remove_empty') },
            { value: 'trim-whitespace', label: t('mode_trim') },
            { value: 'merge-blank', label: t('mode_merge') },
            { value: 'join-one-line', label: t('mode_join') },
          ]} />
          <Button onClick={handleTrim}>{t('trim_button')}</Button>
        </div>
        {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
        {output && (
          <div className="relative">
            <pre className="rounded-md border border-gray-200 bg-gray-50 p-4 overflow-auto text-sm text-gray-900 whitespace-pre-wrap"><code>{output}</code></pre>
            <div className="mt-2 flex justify-end"><CopyButton text={output} /></div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
