'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Input from '../../components/ui/Input';
import CopyButton from '../../components/ui/CopyButton';
import type { ToolMeta } from '../registry';
import { generateAsciiArt } from './logic';

export default function AsciiArtTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.ascii-art');
  const [input, setInput] = useState('');
  const output = input ? generateAsciiArt(input) : '';
  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <Input label={t('text_label')} value={input} onChange={e => setInput(e.target.value)} placeholder={t('input_placeholder')} />
        {output && <div className="relative"><pre className="rounded-md border bg-gray-900 text-green-400 p-4 text-xs font-mono overflow-auto">{output}</pre><div className="mt-2 flex justify-end"><CopyButton text={output} /></div></div>}
      </div>
    </ToolLayout>
  );
}
