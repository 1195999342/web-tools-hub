'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Textarea from '../../components/ui/Textarea';
import Button from '../../components/ui/Button';
import Tabs from '../../components/ui/Tabs';
import CopyButton from '../../components/ui/CopyButton';
import type { ToolMeta } from '../registry';
import { jsonToQueryString, queryStringToJSON } from './logic';

export default function JsonQuerystringTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.json-querystring');
  const [tab, setTab] = useState('j2q');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const tabs = [{ id: 'j2q', label: t('json_to_qs') }, { id: 'q2j', label: t('qs_to_json') }];

  const handleConvert = () => {
    const r = tab === 'j2q' ? jsonToQueryString(input) : queryStringToJSON(input);
    if (r.error) { setError(r.error); setOutput(''); }
    else { setOutput(r.output ?? ''); setError(''); }
  };

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <Tabs tabs={tabs} activeTab={tab} onTabChange={id => { setTab(id); setInput(''); setOutput(''); setError(''); }} />
        <Textarea value={input} onChange={e => setInput(e.target.value)} placeholder={t('input_placeholder')} rows={6} />
        <Button onClick={handleConvert}>{t('convert_button')}</Button>
        {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
        {output && (
          <div className="relative">
            <pre className="rounded-md border border-gray-200 bg-gray-50 p-4 text-sm text-gray-900 whitespace-pre-wrap overflow-auto">{output}</pre>
            <div className="mt-2 flex justify-end"><CopyButton text={output} /></div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
