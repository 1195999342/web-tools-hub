'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Input from '../../components/ui/Input';
import CopyButton from '../../components/ui/CopyButton';
import type { ToolMeta } from '../registry';
import { generateRainbowHtml } from './logic';

export default function ColorTextTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.color-text');
  const [input, setInput] = useState('');
  const html = input ? generateRainbowHtml(input) : '';
  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <Input label={t('text_label')} value={input} onChange={e => setInput(e.target.value)} placeholder={t('input_placeholder')} />
        {html && (
          <>
            <div className="rounded-md border bg-white p-4 text-2xl" dangerouslySetInnerHTML={{ __html: html }} />
            <div className="relative"><pre className="rounded-md border bg-gray-50 p-4 text-xs overflow-auto">{html}</pre><div className="mt-2 flex justify-end"><CopyButton text={html} /></div></div>
          </>
        )}
      </div>
    </ToolLayout>
  );
}
