'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Textarea from '../../components/ui/Textarea';
import Button from '../../components/ui/Button';
import Tabs from '../../components/ui/Tabs';
import CopyButton from '../../components/ui/CopyButton';
import type { ToolMeta } from '../registry';
import { matrixToJson, jsonToMatrix } from './logic';

export default function MatrixJsonTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.matrix-json');
  const [tab, setTab] = useState('m2j');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const handleConvert = () => { const r = tab === 'm2j' ? matrixToJson(input) : jsonToMatrix(input); if (r.error) { setError(r.error); setOutput(''); } else { setOutput(r.output!); setError(''); } };
  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <Tabs tabs={[{ id: 'm2j', label: t('matrix_to_json') }, { id: 'j2m', label: t('json_to_matrix') }]} activeTab={tab} onTabChange={id => { setTab(id); setInput(''); setOutput(''); setError(''); }} />
        <Textarea value={input} onChange={e => setInput(e.target.value)} placeholder={t('input_placeholder')} rows={6} />
        <Button onClick={handleConvert}>{t('convert_button')}</Button>
        {error && <p className="text-sm text-red-600">{error}</p>}
        {output && <div className="relative"><pre className="rounded-md border bg-gray-50 p-4 text-sm whitespace-pre-wrap">{output}</pre><div className="mt-2 flex justify-end"><CopyButton text={output} /></div></div>}
      </div>
    </ToolLayout>
  );
}
