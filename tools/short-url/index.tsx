'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import CopyButton from '../../components/ui/CopyButton';
import type { ToolMeta } from '../registry';
import { simulateShorten } from './logic';

export default function ShortUrlTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.short-url');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const handleShorten = () => setOutput(`https://s.url/${simulateShorten(input)}`);
  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <Input label={t('url_label')} value={input} onChange={e => setInput(e.target.value)} placeholder="https://example.com/long-url" />
        <Button onClick={handleShorten}>{t('shorten_button')}</Button>
        {output && <div className="flex items-center gap-2"><code className="flex-1 rounded border bg-gray-50 p-3 text-sm">{output}</code><CopyButton text={output} /></div>}
      </div>
    </ToolLayout>
  );
}
