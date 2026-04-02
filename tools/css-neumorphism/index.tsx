'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import CopyButton from '../../components/ui/CopyButton';
import Slider from '../../components/ui/Slider';
import Select from '../../components/ui/Select';
import type { ToolMeta } from '../registry';
import { generateCSS, type NeuConfig } from './logic';

export default function CSSNeumorphismTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.css-neumorphism');
  const [config, setConfig] = useState<NeuConfig>({ distance: 10, blur: 20, intensity: 30, bgColor: '#e0e0e0', shape: 'flat' });
  const css = generateCSS(config);
  const update = (key: keyof NeuConfig, val: any) => setConfig(prev => ({ ...prev, [key]: val }));

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-center h-64 rounded-lg" style={{ background: config.bgColor }}>
          <div className="w-40 h-40 rounded-2xl" style={{ background: config.bgColor, ...parseCSS(css) }} />
        </div>
        <Slider label={t('distance_label')} min={1} max={30} value={config.distance} onChange={v => update('distance', v)} />
        <Slider label={t('blur_label')} min={1} max={60} value={config.blur} onChange={v => update('blur', v)} />
        <Slider label={t('intensity_label')} min={5} max={80} value={config.intensity} onChange={v => update('intensity', v)} />
        <Select label={t('shape_label')} options={[{ value: 'flat', label: 'Flat' }, { value: 'concave', label: 'Concave' }, { value: 'convex', label: 'Convex' }, { value: 'pressed', label: 'Pressed' }]} value={config.shape} onChange={e => update('shape', e.target.value)} />
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-gray-700">{t('color_label')}</label>
          <input type="color" value={config.bgColor} onChange={e => update('bgColor', e.target.value)} className="w-10 h-10 rounded border border-gray-300 cursor-pointer" />
        </div>
        <div className="relative">
          <pre className="rounded-md border border-gray-200 bg-gray-50 p-4 text-sm text-gray-900 whitespace-pre-wrap">{css}</pre>
          <div className="mt-2 flex justify-end"><CopyButton text={css} /></div>
        </div>
      </div>
    </ToolLayout>
  );
}

function parseCSS(css: string): React.CSSProperties {
  const style: any = {};
  css.split('\n').forEach(line => {
    const [key, ...rest] = line.split(':');
    if (!key || rest.length === 0) return;
    const val = rest.join(':').replace(';', '').trim();
    const camel = key.trim().replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    style[camel] = val;
  });
  return style;
}
