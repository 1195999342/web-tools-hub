'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Input from '../../components/ui/Input';
import type { ToolMeta } from '../registry';
import { getStrokeOrder } from './logic';

export default function HanziStrokeTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.hanzi-stroke');
  const [input, setInput] = useState('');
  const chars = [...input].filter(c => c.charCodeAt(0) > 0x4e00);
  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <Input label={t('input_label')} value={input} onChange={e => setInput(e.target.value)} placeholder={t('input_placeholder')} />
        {chars.length > 0 && (
          <div className="space-y-3">{chars.map((c, i) => {
            const strokes = getStrokeOrder(c);
            return <div key={i} className="flex items-start gap-4 border-b pb-2"><span className="text-4xl">{c}</span><div><p className="text-sm font-medium">{strokes.length} strokes</p><p className="text-sm text-gray-600">{strokes.join(' → ')}</p></div></div>;
          })}</div>
        )}
      </div>
    </ToolLayout>
  );
}
