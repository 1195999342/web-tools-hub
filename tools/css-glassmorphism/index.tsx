'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import CopyButton from '../../components/ui/CopyButton';
import Slider from '../../components/ui/Slider';
import type { ToolMeta } from '../registry';
import { generateCSS, type GlassConfig } from './logic';

export default function CSSGlassmorphismTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.css-glassmorphism');
  const [config, setConfig] = useState<GlassConfig>({ blur: 10, opacity: 25, bgColor: '#ffffff', borderRadius: 16 });
  const css = generateCSS(config);
  const update = (key: keyof GlassConfig, val: any) => setConfig(prev => ({ ...prev, [key]: val }));

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <div className="relative h-64 rounded-lg overflow-hidden" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-64 h-40 flex items-center justify-center text-white font-bold text-lg" style={{ background: `rgba(255,255,255,${config.opacity / 100})`, backdropFilter: `blur(${config.blur}px)`, WebkitBackdropFilter: `blur(${config.blur}px)`, borderRadius: `${config.borderRadius}px`, border: '1px solid rgba(255,255,255,0.18)' }}>
              {t('preview_text')}
            </div>
          </div>
        </div>
        <Slider label={t('blur_label')} min={0} max={30} value={config.blur} onChange={v => update('blur', v)} />
        <Slider label={t('opacity_label')} min={0} max={100} value={config.opacity} onChange={v => update('opacity', v)} />
        <Slider label={t('radius_label')} min={0} max={50} value={config.borderRadius} onChange={v => update('borderRadius', v)} />
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
