'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import CopyButton from '../../components/ui/CopyButton';
import Slider from '../../components/ui/Slider';
import Button from '../../components/ui/Button';
import type { ToolMeta } from '../registry';
import { PRESETS, generateCSS, generateTransition } from './logic';

export default function CSSBezierTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.css-bezier');
  const [values, setValues] = useState<[number, number, number, number]>([0.25, 0.1, 0.25, 1.0]);
  const [duration, setDuration] = useState(500);
  const [animate, setAnimate] = useState(false);

  const css = generateCSS(values);
  const transition = generateTransition('all', duration, values);

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-2">
          {PRESETS.map(p => (
            <Button key={p.name} variant="ghost" size="sm" onClick={() => setValues([...p.values] as any)}>{p.name}</Button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Slider label="X1" min={0} max={1} step={0.01} value={values[0]} onChange={v => setValues([v, values[1], values[2], values[3]])} />
          <Slider label="Y1" min={-1} max={2} step={0.01} value={values[1]} onChange={v => setValues([values[0], v, values[2], values[3]])} />
          <Slider label="X2" min={0} max={1} step={0.01} value={values[2]} onChange={v => setValues([values[0], values[1], v, values[3]])} />
          <Slider label="Y2" min={-1} max={2} step={0.01} value={values[3]} onChange={v => setValues([values[0], values[1], values[2], v])} />
        </div>
        <Slider label={t('duration_label')} min={100} max={3000} step={50} value={duration} onChange={setDuration} />
        <div className="relative h-16 bg-gray-100 rounded-lg overflow-hidden">
          <div
            className="absolute top-2 w-12 h-12 bg-blue-500 rounded-lg"
            style={{ left: animate ? 'calc(100% - 60px)' : '8px', transition: `left ${duration}ms ${css}` }}
          />
        </div>
        <Button onClick={() => setAnimate(!animate)}>{t('preview_button')}</Button>
        <div className="relative">
          <pre className="rounded-md border border-gray-200 bg-gray-50 p-4 text-sm text-gray-900 whitespace-pre-wrap">{transition}</pre>
          <div className="mt-2 flex justify-end"><CopyButton text={transition} /></div>
        </div>
      </div>
    </ToolLayout>
  );
}
