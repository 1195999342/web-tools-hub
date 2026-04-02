'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Textarea from '../../components/ui/Textarea';
import Button from '../../components/ui/Button';
import CopyButton from '../../components/ui/CopyButton';
import Toggle from '../../components/ui/Toggle';
import { dedup } from './logic';
import type { ToolMeta } from '../../tools/registry';

export default function TextDedupTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.text-dedup');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(true);
  const [stats, setStats] = useState('');
  const [error, setError] = useState('');

  function handleDedup() {
    setError('');
    const result = dedup(input, caseSensitive);
    if (result.error) setError(result.error);
    else {
      setOutput(result.output!.text);
      setStats(t('stats', { original: result.output!.originalCount, result: result.output!.resultCount, removed: result.output!.removedCount }));
    }
  }

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <Textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder={t('input_placeholder')} rows={8} />
        <div className="flex items-center gap-4">
          <Button onClick={handleDedup}>{t('dedup_button')}</Button>
          <Toggle label={t('case_sensitive')} checked={caseSensitive} onChange={setCaseSensitive} />
        </div>
        {stats && <p className="text-sm text-gray-600">{stats}</p>}
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
