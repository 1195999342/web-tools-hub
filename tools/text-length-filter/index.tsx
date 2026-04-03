'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Textarea from '../../components/ui/Textarea';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import CopyButton from '../../components/ui/CopyButton';
import type { ToolMeta } from '../registry';
import { filterByLength } from './logic';

export default function TextLengthFilterTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.text-length-filter');
  const [input, setInput] = useState('');
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(1000);
  const [output, setOutput] = useState('');
  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <Textarea value={input} onChange={e => setInput(e.target.value)} placeholder={t('input_placeholder')} rows={6} />
        <div className="flex gap-4"><Input label={t('min_label')} type="number" value={min} onChange={e => setMin(Number(e.target.value))} /><Input label={t('max_label')} type="number" value={max} onChange={e => setMax(Number(e.target.value))} /></div>
        <Button onClick={() => setOutput(filterByLength(input, min, max))}>{t('filter_button')}</Button>
        {output && <div className="relative"><pre className="rounded-md border bg-gray-50 p-4 text-sm whitespace-pre-wrap">{output}</pre><div className="mt-2 flex justify-end"><CopyButton text={output} /></div></div>}
      </div>
    </ToolLayout>
  );
}
