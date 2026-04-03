'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Textarea from '../../components/ui/Textarea';
import Button from '../../components/ui/Button';
import Tabs from '../../components/ui/Tabs';
import CopyButton from '../../components/ui/CopyButton';
import type { ToolMeta } from '../registry';
import { htmlToUbb, ubbToHtml } from './logic';

export default function HtmlUbbTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.html-ubb');
  const [tab, setTab] = useState('h2u');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const handleConvert = () => setOutput(tab === 'h2u' ? htmlToUbb(input) : ubbToHtml(input));
  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <Tabs tabs={[{ id: 'h2u', label: t('html_to_ubb') }, { id: 'u2h', label: t('ubb_to_html') }]} activeTab={tab} onTabChange={id => { setTab(id); setInput(''); setOutput(''); }} />
        <Textarea value={input} onChange={e => setInput(e.target.value)} placeholder={t('input_placeholder')} rows={6} />
        <Button onClick={handleConvert}>{t('convert_button')}</Button>
        {output && <div className="relative"><pre className="rounded-md border bg-gray-50 p-4 text-sm whitespace-pre-wrap">{output}</pre><div className="mt-2 flex justify-end"><CopyButton text={output} /></div></div>}
      </div>
    </ToolLayout>
  );
}
