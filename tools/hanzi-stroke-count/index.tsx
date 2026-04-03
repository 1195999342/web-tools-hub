'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Textarea from '../../components/ui/Textarea';
import type { ToolMeta } from '../registry';
import { analyzeStrokes } from './logic';

export default function HanziStrokeCountTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.hanzi-stroke-count');
  const [input, setInput] = useState('');
  const results = analyzeStrokes(input);
  const total = results.reduce((a, b) => a + b.count, 0);
  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <Textarea value={input} onChange={e => setInput(e.target.value)} placeholder={t('input_placeholder')} rows={4} />
        {results.length > 0 && (
          <>
            <p className="text-sm">{t('total_label')}: {total} ({results.length} characters)</p>
            <div className="flex flex-wrap gap-2">{results.map((r, i) => <span key={i} className="inline-flex items-center gap-1 rounded border px-2 py-1 text-sm"><span className="text-lg">{r.char}</span><span className="text-gray-500">~{r.count}</span></span>)}</div>
          </>
        )}
      </div>
    </ToolLayout>
  );
}
