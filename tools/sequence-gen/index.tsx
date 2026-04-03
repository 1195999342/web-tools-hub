'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import CopyButton from '../../components/ui/CopyButton';
import type { ToolMeta } from '../registry';
import { generateSequence } from './logic';

export default function SequenceGenTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.sequence-gen');
  const [start, setStart] = useState(1);
  const [end, setEnd] = useState(100);
  const [step, setStep] = useState(1);
  const [prefix, setPrefix] = useState('');
  const [suffix, setSuffix] = useState('');
  const [output, setOutput] = useState('');
  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <div className="flex gap-4"><Input label={t('start_label')} type="number" value={start} onChange={e => setStart(Number(e.target.value))} /><Input label={t('end_label')} type="number" value={end} onChange={e => setEnd(Number(e.target.value))} /><Input label={t('step_label')} type="number" value={step} onChange={e => setStep(Number(e.target.value))} /></div>
        <div className="flex gap-4"><Input label={t('prefix_label')} value={prefix} onChange={e => setPrefix(e.target.value)} /><Input label={t('suffix_label')} value={suffix} onChange={e => setSuffix(e.target.value)} /></div>
        <Button onClick={() => setOutput(generateSequence(start, end, step || 1, prefix, suffix))}>{t('generate_button')}</Button>
        {output && <div className="relative"><pre className="rounded-md border bg-gray-50 p-4 text-sm whitespace-pre-wrap max-h-[400px] overflow-auto">{output}</pre><div className="mt-2 flex justify-end"><CopyButton text={output} /></div></div>}
      </div>
    </ToolLayout>
  );
}
