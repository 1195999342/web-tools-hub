'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Textarea from '../../components/ui/Textarea';
import Button from '../../components/ui/Button';
import type { ToolMeta } from '../registry';
import { highlightJSON } from './logic';

export default function JsonHighlightTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.json-highlight');
  const [input, setInput] = useState('');
  const [html, setHtml] = useState('');
  const [error, setError] = useState('');

  const handleHighlight = () => {
    const r = highlightJSON(input);
    if (r.error) { setError(r.error); setHtml(''); }
    else { setHtml(r.html ?? ''); setError(''); }
  };

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <Textarea value={input} onChange={e => setInput(e.target.value)} placeholder={t('input_placeholder')} rows={8} />
        <Button onClick={handleHighlight}>{t('highlight_button')}</Button>
        {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
        {html && (
          <pre className="rounded-md border border-gray-200 bg-gray-50 p-4 text-sm font-mono overflow-auto max-h-[500px]"
            dangerouslySetInnerHTML={{ __html: html }} />
        )}
      </div>
    </ToolLayout>
  );
}
