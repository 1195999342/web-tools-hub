'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Textarea from '../../components/ui/Textarea';
import Button from '../../components/ui/Button';
import Tabs from '../../components/ui/Tabs';
import CopyButton from '../../components/ui/CopyButton';
import type { ToolMeta } from '../registry';
import { jsEscape, jsUnescape } from './logic';

export default function EscapeEncoderTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.escape-encoder');
  const [tab, setTab] = useState('escape');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const handleAction = () => setOutput(tab === 'escape' ? jsEscape(input) : jsUnescape(input));

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <Tabs tabs={[{ id: 'escape', label: t('escape_tab') }, { id: 'unescape', label: t('unescape_tab') }]} activeTab={tab} onTabChange={id => { setTab(id); setInput(''); setOutput(''); }} />
        <Textarea value={input} onChange={e => setInput(e.target.value)} placeholder={t('input_placeholder')} rows={6} />
        <Button onClick={handleAction}>{tab === 'escape' ? t('escape_tab') : t('unescape_tab')}</Button>
        {output && <div className="relative"><pre className="rounded-md border border-gray-200 bg-gray-50 p-4 text-sm whitespace-pre-wrap">{output}</pre><div className="mt-2 flex justify-end"><CopyButton text={output} /></div></div>}
      </div>
    </ToolLayout>
  );
}
