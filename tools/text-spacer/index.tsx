'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Textarea from '../../components/ui/Textarea';
import Input from '../../components/ui/Input';
import CopyButton from '../../components/ui/CopyButton';
import type { ToolMeta } from '../registry';
import { addSpacing } from './logic';

export default function TextSpacerTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.text-spacer');
  const [input, setInput] = useState('');
  const [spacer, setSpacer] = useState(' ');
  const output = input ? addSpacing(input, spacer) : '';
  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <Textarea value={input} onChange={e => setInput(e.target.value)} placeholder={t('input_placeholder')} rows={4} />
        <Input label={t('spacer_label')} value={spacer} onChange={e => setSpacer(e.target.value)} />
        {output && <div className="relative"><pre className="rounded-md border bg-gray-50 p-4 text-sm whitespace-pre-wrap">{output}</pre><div className="mt-2 flex justify-end"><CopyButton text={output} /></div></div>}
      </div>
    </ToolLayout>
  );
}
