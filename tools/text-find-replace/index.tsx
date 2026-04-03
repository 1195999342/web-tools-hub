'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Textarea from '../../components/ui/Textarea';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Toggle from '../../components/ui/Toggle';
import CopyButton from '../../components/ui/CopyButton';
import type { ToolMeta } from '../registry';
import { findReplace } from './logic';

export default function TextFindReplaceTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.text-find-replace');
  const [input, setInput] = useState('');
  const [find, setFind] = useState('');
  const [replace, setReplace] = useState('');
  const [useRegex, setUseRegex] = useState(false);
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [output, setOutput] = useState('');
  const [count, setCount] = useState(0);
  const handleReplace = () => { const r = findReplace(input, find, replace, useRegex, caseSensitive); setOutput(r.output); setCount(r.count); };
  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <Textarea value={input} onChange={e => setInput(e.target.value)} placeholder={t('input_placeholder')} rows={6} />
        <div className="flex gap-4"><Input label={t('find_label')} value={find} onChange={e => setFind(e.target.value)} /><Input label={t('replace_label')} value={replace} onChange={e => setReplace(e.target.value)} /></div>
        <div className="flex gap-4"><Toggle label={t('regex_label')} checked={useRegex} onChange={setUseRegex} /><Toggle label={t('case_label')} checked={caseSensitive} onChange={setCaseSensitive} /></div>
        <Button onClick={handleReplace}>{t('replace_button')}</Button>
        {output && <><p className="text-sm text-gray-600">{count} replacements</p><div className="relative"><pre className="rounded-md border bg-gray-50 p-4 text-sm whitespace-pre-wrap">{output}</pre><div className="mt-2 flex justify-end"><CopyButton text={output} /></div></div></>}
      </div>
    </ToolLayout>
  );
}
