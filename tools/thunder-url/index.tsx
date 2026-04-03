'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Textarea from '../../components/ui/Textarea';
import Button from '../../components/ui/Button';
import Tabs from '../../components/ui/Tabs';
import CopyButton from '../../components/ui/CopyButton';
import type { ToolMeta } from '../registry';
import { decodeThunder, encodeThunder } from './logic';

export default function ThunderUrlTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.thunder-url');
  const [tab, setTab] = useState('decode');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const handleAction = () => setOutput(tab === 'decode' ? decodeThunder(input) : encodeThunder(input));
  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <Tabs tabs={[{ id: 'decode', label: t('decode_tab') }, { id: 'encode', label: t('encode_tab') }]} activeTab={tab} onTabChange={id => { setTab(id); setInput(''); setOutput(''); }} />
        <Textarea value={input} onChange={e => setInput(e.target.value)} placeholder={t('input_placeholder')} rows={4} />
        <Button onClick={handleAction}>{tab === 'decode' ? t('decode_tab') : t('encode_tab')}</Button>
        {output && <div className="relative"><pre className="rounded-md border bg-gray-50 p-4 text-sm whitespace-pre-wrap break-all">{output}</pre><div className="mt-2 flex justify-end"><CopyButton text={output} /></div></div>}
      </div>
    </ToolLayout>
  );
}
