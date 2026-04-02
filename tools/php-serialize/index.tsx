'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Textarea from '../../components/ui/Textarea';
import Button from '../../components/ui/Button';
import CopyButton from '../../components/ui/CopyButton';
import Tabs from '../../components/ui/Tabs';
import { phpSerialize, phpUnserialize } from './logic';
import type { ToolMeta } from '../../tools/registry';

export default function PhpSerializeTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.php-serialize');
  const [activeTab, setActiveTab] = useState('serialize');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const tabs = [
    { id: 'serialize', label: t('serialize_tab') },
    { id: 'unserialize', label: t('unserialize_tab') },
  ];

  function handleAction() {
    setError('');
    const result = activeTab === 'serialize' ? phpSerialize(input) : phpUnserialize(input);
    if (result.error) setError(result.error);
    else setOutput(result.output ?? '');
  }

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <Tabs tabs={tabs} activeTab={activeTab} onTabChange={(id) => { setActiveTab(id); setInput(''); setOutput(''); setError(''); }} />
        <Textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder={t('input_placeholder')} rows={6} />
        <Button onClick={handleAction}>{activeTab === 'serialize' ? t('serialize_button') : t('unserialize_button')}</Button>
        {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
        {output && (
          <div className="relative">
            <pre className="rounded-md border border-gray-200 bg-gray-50 p-4 overflow-auto text-sm text-gray-900 whitespace-pre-wrap break-all"><code>{output}</code></pre>
            <div className="mt-2 flex justify-end"><CopyButton text={output} /></div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
