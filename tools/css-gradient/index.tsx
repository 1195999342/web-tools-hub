'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import CopyButton from '../../components/ui/CopyButton';
import Slider from '../../components/ui/Slider';
import Select from '../../components/ui/Select';
import type { ToolMeta } from '../registry';
import { generateCSS, type GradientStop } from './logic';

export default function CSSGradientTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.css-gradient');
  const [type, setType] = useState<'linear' | 'radial'>('linear');
  const [angle, setAngle] = useState(90);
  const [shape, setShape] = useState<'circle' | 'ellipse'>('circle');
  const [stops, setStops] = useState<GradientStop[]>([
    { color: '#667eea', position: 0 },
    { color: '#764ba2', position: 100 },
  ]);

  const css = generateCSS(type, angle, shape, stops);
  const gradient = css.replace('background: ', '').replace(';', '');

  const updateStop = (i: number, key: keyof GradientStop, val: string | number) => {
    const next = [...stops];
    (next[i] as any)[key] = val;
    setStops(next);
  };

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <div className="h-40 rounded-lg border border-gray-200" style={{ background: gradient }} />
        <div className="flex gap-4 flex-wrap">
          <Select label={t('type_label')} options={[{ value: 'linear', label: t('linear') }, { value: 'radial', label: t('radial') }]} value={type} onChange={e => setType(e.target.value as any)} />
          {type === 'linear' && <Slider label={t('angle_label')} min={0} max={360} value={angle} onChange={setAngle} />}
          {type === 'radial' && <Select label={t('shape_label')} options={[{ value: 'circle', label: 'Circle' }, { value: 'ellipse', label: 'Ellipse' }]} value={shape} onChange={e => setShape(e.target.value as any)} />}
        </div>
        {stops.map((s, i) => (
          <div key={i} className="flex items-center gap-3">
            <input type="color" value={s.color} onChange={e => updateStop(i, 'color', e.target.value)} className="w-10 h-10 rounded border border-gray-300 cursor-pointer" />
            <Slider label={`${t('position')} ${i + 1}`} min={0} max={100} value={s.position} onChange={v => updateStop(i, 'position', v)} />
          </div>
        ))}
        <div className="relative">
          <pre className="rounded-md border border-gray-200 bg-gray-50 p-4 text-sm text-gray-900 whitespace-pre-wrap">{css}</pre>
          <div className="mt-2 flex justify-end"><CopyButton text={css} /></div>
        </div>
      </div>
    </ToolLayout>
  );
}
