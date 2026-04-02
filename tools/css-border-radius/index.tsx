'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import CopyButton from '../../components/ui/CopyButton';
import Slider from '../../components/ui/Slider';
import Toggle from '../../components/ui/Toggle';
import type { ToolMeta } from '../registry';
import { generateCSS, type BorderRadiusConfig } from './logic';

export default function CSSBorderRadiusTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.css-border-radius');
  const [config, setConfig] = useState<BorderRadiusConfig>({ topLeft: 16, topRight: 16, bottomRight: 16, bottomLeft: 16, linked: true, unit: 'px' });
  const css = generateCSS(config);

  const updateCorner = (key: keyof BorderRadiusConfig, val: number) => {
    if (config.linked) {
      setConfig(prev => ({ ...prev, topLeft: val, topRight: val, bottomRight: val, bottomLeft: val }));
    } else {
      setConfig(prev => ({ ...prev, [key]: val }));
    }
  };

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-center h-48 bg-gray-100 rounded-lg">
          <div className="w-40 h-40 bg-blue-500" style={{ borderRadius: `${config.topLeft}${config.unit} ${config.topRight}${config.unit} ${config.bottomRight}${config.unit} ${config.bottomLeft}${config.unit}` }} />
        </div>
        <Toggle label={t('linked_label')} checked={config.linked} onChange={v => setConfig(prev => ({ ...prev, linked: v }))} />
        <div className="grid grid-cols-2 gap-4">
          <Slider label={t('top_left')} min={0} max={100} value={config.topLeft} onChange={v => updateCorner('topLeft', v)} />
          <Slider label={t('top_right')} min={0} max={100} value={config.topRight} onChange={v => updateCorner('topRight', v)} />
          <Slider label={t('bottom_left')} min={0} max={100} value={config.bottomLeft} onChange={v => updateCorner('bottomLeft', v)} />
          <Slider label={t('bottom_right')} min={0} max={100} value={config.bottomRight} onChange={v => updateCorner('bottomRight', v)} />
        </div>
        <div className="relative">
          <pre className="rounded-md border border-gray-200 bg-gray-50 p-4 text-sm text-gray-900 whitespace-pre-wrap">{css}</pre>
          <div className="mt-2 flex justify-end"><CopyButton text={css} /></div>
        </div>
      </div>
    </ToolLayout>
  );
}
