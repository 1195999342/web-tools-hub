'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Textarea from '../../components/ui/Textarea';
import Button from '../../components/ui/Button';
import { calculate } from './logic';
import type { Stats } from './logic';
import type { ToolMeta } from '../registry';

export default function StatisticsTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.statistics');
  const [input, setInput] = useState('');
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState('');

  function handleCalc() {
    setError('');
    const nums = input.split(/[\n,\s]+/).map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
    if (!nums.length) { setError('Enter at least one number'); return; }
    setStats(calculate(nums));
  }

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <Textarea label="Numbers (one per line, or comma/space separated)" value={input} onChange={e => setInput(e.target.value)} rows={5} placeholder="10\n20\n30\n40\n50" />
        <Button onClick={handleCalc}>Calculate</Button>
        {error && <p className="text-sm text-red-600">{error}</p>}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {([
              ['Count', stats.count],
              ['Sum', stats.sum.toFixed(4)],
              ['Mean', stats.mean.toFixed(4)],
              ['Median', stats.median.toFixed(4)],
              ['Mode', stats.mode.length ? stats.mode.join(', ') : 'N/A'],
              ['Min', stats.min],
              ['Max', stats.max],
              ['Variance', stats.variance.toFixed(4)],
              ['Std Dev', stats.stddev.toFixed(4)],
            ] as [string, string | number][]).map(([label, val]) => (
              <div key={label} className="rounded-md border border-gray-200 bg-gray-50 p-3">
                <p className="text-xs text-gray-500">{label}</p>
                <p className="text-lg font-semibold text-gray-900">{val}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
