'use client';
import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Textarea from '../../components/ui/Textarea';
import type { ToolMeta } from '../registry';
import { sumNumbers } from './logic';

export default function NumberSumTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.number-sum');
  const [input, setInput] = useState('');
  const stats = useMemo(() => sumNumbers(input), [input]);

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <Textarea label="Numbers (one per line, or separated by commas/spaces)" value={input} onChange={e => setInput(e.target.value)} rows={8} placeholder="Enter numbers, e.g.:\n10\n20\n30" />
        {stats.count > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { label: 'Sum', value: stats.sum.toLocaleString() },
              { label: 'Count', value: stats.count.toLocaleString() },
              { label: 'Average', value: stats.avg.toFixed(2) },
              { label: 'Min', value: stats.min.toLocaleString() },
              { label: 'Max', value: stats.max.toLocaleString() },
            ].map(s => (
              <div key={s.label} className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-500">{s.label}</p>
                <p className="text-lg font-bold text-gray-900">{s.value}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
