'use client';
import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Textarea from '../../components/ui/Textarea';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import type { ToolMeta } from '../registry';
import { parseData, drawChart, type ChartType } from './logic';

export default function ChartGeneratorTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.chart-generator');
  const [input, setInput] = useState('Apple,30\nBanana,20\nCherry,50\nDate,15');
  const [type, setType] = useState<ChartType>('bar');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleDraw = () => {
    if (!canvasRef.current) return;
    const data = parseData(input);
    drawChart(canvasRef.current, type, data);
  };

  useEffect(() => { handleDraw(); }, [input, type]);

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <Textarea value={input} onChange={e => setInput(e.target.value)} placeholder={t('input_placeholder')} rows={6} />
        <Select label={t('type_label')} options={[{ value: 'bar', label: t('bar') }, { value: 'pie', label: t('pie') }, { value: 'line', label: t('line') }]} value={type} onChange={e => setType(e.target.value as ChartType)} />
        <Button onClick={handleDraw}>{t('draw_button')}</Button>
        <canvas ref={canvasRef} width={600} height={400} className="border border-gray-200 rounded w-full" />
      </div>
    </ToolLayout>
  );
}
