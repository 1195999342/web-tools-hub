'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { calcPPI } from './logic';
import type { ToolMeta } from '../registry';

export default function PpiCalcTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.ppi-calc');
  const [width, setWidth] = useState('1920');
  const [height, setHeight] = useState('1080');
  const [diagonal, setDiagonal] = useState('15.6');
  const [ppi, setPpi] = useState<number | null>(null);

  function handleCalc() {
    const w = parseInt(width), h = parseInt(height), d = parseFloat(diagonal);
    if (isNaN(w) || isNaN(h) || isNaN(d) || d <= 0) return;
    setPpi(calcPPI(w, h, d));
  }

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-3 gap-3">
          <Input label="Width (px)" type="number" value={width} onChange={e => setWidth(e.target.value)} />
          <Input label="Height (px)" type="number" value={height} onChange={e => setHeight(e.target.value)} />
          <Input label="Screen size (inches)" type="number" step="0.1" value={diagonal} onChange={e => setDiagonal(e.target.value)} />
        </div>
        <Button onClick={handleCalc}>Calculate</Button>
        {ppi !== null && (
          <div className="rounded-md border border-gray-200 bg-gray-50 p-4 text-center">
            <p className="text-sm text-gray-500">Pixels Per Inch</p>
            <p className="text-4xl font-bold text-gray-900">{ppi.toFixed(2)}</p>
            <p className="text-sm text-gray-500 mt-1">PPI</p>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
