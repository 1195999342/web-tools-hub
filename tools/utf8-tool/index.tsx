'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Textarea from '../../components/ui/Textarea';
import Button from '../../components/ui/Button';
import Tabs from '../../components/ui/Tabs';
import CopyButton from '../../components/ui/CopyButton';
import type { ToolMeta } from '../registry';
import { textToUtf8Bytes, utf8BytesToText } from './logic';

export default function Utf8Tool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.utf8-tool');
  const [tab, setTab] = useState('encode');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const handleAction = () => setOutput(tab === 'encode' ? textToUtf8Bytes(input) : utf8BytesToText(input));
  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <Tabs tabs={[{ id: 'encode', label: t('text_to_bytes') }, { id: 'decode', label: t('bytes_to_text') }]} activeTab={tab} onTabChange={id => { setTab(id); setInput(''); setOutput(''); }} />
        <Textarea value={input} onChange={e => setInput(e.target.value)} placeholder={t('input_placeholder')} rows={6} />
        <Button onClick={handleAction}>{t('convert_button')}</Button>
        {output && <div className="relative"><pre className="rounded-md border bg-gray-50 p-4 text-sm whitespace-pre-wrap break-all">{output}</pre><div className="mt-2 flex justify-end"><CopyButton text={output} /></div></div>}
      </div>
    </ToolLayout>
  );
}
