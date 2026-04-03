'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Textarea from '../../components/ui/Textarea';
import Button from '../../components/ui/Button';
import Tabs from '../../components/ui/Tabs';
import CopyButton from '../../components/ui/CopyButton';
import type { ToolMeta } from '../registry';
import { gzipCompress, gzipDecompress } from './logic';

export default function GzipTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.gzip-tool');
  const [tab, setTab] = useState('compress');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const handleAction = async () => {
    try {
      setError('');
      setOutput(tab === 'compress' ? await gzipCompress(input) : await gzipDecompress(input));
    } catch (e) { setError((e as Error).message); setOutput(''); }
  };

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <Tabs tabs={[{ id: 'compress', label: t('compress_tab') }, { id: 'decompress', label: t('decompress_tab') }]} activeTab={tab} onTabChange={id => { setTab(id); setInput(''); setOutput(''); setError(''); }} />
        <Textarea value={input} onChange={e => setInput(e.target.value)} placeholder={t('input_placeholder')} rows={6} />
        <Button onClick={handleAction}>{tab === 'compress' ? t('compress_tab') : t('decompress_tab')}</Button>
        {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
        {output && <div className="relative"><pre className="rounded-md border border-gray-200 bg-gray-50 p-4 text-sm whitespace-pre-wrap break-all">{output}</pre><div className="mt-2 flex justify-end"><CopyButton text={output} /></div></div>}
      </div>
    </ToolLayout>
  );
}
