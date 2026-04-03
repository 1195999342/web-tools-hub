'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Textarea from '../../components/ui/Textarea';
import Button from '../../components/ui/Button';
import { linearRegression } from './logic';
import type { RegressionResult } from './logic';
import type { ToolMeta } from '../registry';

export default function RegressionTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.regression');
  const [input, setInput] = useState('1, 2\n2, 4\n3, 5\n4, 4\n5, 5');
  const [result, setResult] = useState<RegressionResult | null>(null);
  const [error, setError] = useState('');

  function handleCalc() {
    setError(''); setResult(null);
    const points = input.trim().split('\n').map(line => {
      const [x, y] = line.split(/[,\s\t]+/).map(Number);
      return { x, y };
    }).filter(p => !isNaN(p.x) && !isNaN(p.y));
    if (points.length < 2) { setError('Need at least 2 data points (x, y per line)'); return; }
    const r = linearRegression(points);
    if (!r) { setError('Cannot compute regression'); return; }
    setResult(r);
  }

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <Textarea label="Data points (x, y per line)" value={input} onChange={e => setInput(e.target.value)} rows={6} placeholder="1, 2&#10;2, 4&#10;3, 5" />
        <Button onClick={handleCalc}>Calculate</Button>
        {error && <p className="text-sm text-red-600">{error}</p>}
        {result && (
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-md border border-gray-200 bg-gray-50 p-4 text-center">
              <p className="text-xs text-gray-500">Slope (a)</p>
              <p className="text-xl font-bold text-gray-900">{result.a.toFixed(6)}</p>
            </div>
            <div className="rounded-md border border-gray-200 bg-gray-50 p-4 text-center">
              <p className="text-xs text-gray-500">Intercept (b)</p>
              <p className="text-xl font-bold text-gray-900">{result.b.toFixed(6)}</p>
            </div>
            <div className="rounded-md border border-gray-200 bg-gray-50 p-4 text-center">
              <p className="text-xs text-gray-500">R²</p>
              <p className="text-xl font-bold text-gray-900">{result.r2.toFixed(6)}</p>
            </div>
            <div className="col-span-3 rounded-md border border-gray-200 bg-blue-50 p-3 text-center">
              <p className="text-sm text-gray-700">y = {result.a.toFixed(4)}x + {result.b.toFixed(4)}</p>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
