'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import CopyButton from '../../components/ui/CopyButton';
import Select from '../../components/ui/Select';
import Slider from '../../components/ui/Slider';
import type { ToolMeta } from '../registry';
import { DIRECTIONS, JUSTIFY, ALIGN, WRAP, generateCSS, type FlexConfig } from './logic';

export default function CSSFlexTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.css-flex');
  const [config, setConfig] = useState<FlexConfig>({ direction: 'row', justifyContent: 'flex-start', alignItems: 'stretch', flexWrap: 'nowrap', gap: 8 });
  const css = generateCSS(config);
  const update = (key: keyof FlexConfig, val: any) => setConfig(prev => ({ ...prev, [key]: val }));

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <Select label={t('direction_label')} options={DIRECTIONS.map(d => ({ value: d, label: d }))} value={config.direction} onChange={e => update('direction', e.target.value)} />
          <Select label={t('justify_label')} options={JUSTIFY.map(j => ({ value: j, label: j }))} value={config.justifyContent} onChange={e => update('justifyContent', e.target.value)} />
          <Select label={t('align_label')} options={ALIGN.map(a => ({ value: a, label: a }))} value={config.alignItems} onChange={e => update('alignItems', e.target.value)} />
          <Select label={t('wrap_label')} options={WRAP.map(w => ({ value: w, label: w }))} value={config.flexWrap} onChange={e => update('flexWrap', e.target.value)} />
        </div>
        <Slider label={t('gap_label')} min={0} max={64} value={config.gap} onChange={v => update('gap', v)} />
        <div className="border border-gray-200 rounded-lg p-4 min-h-[160px]" style={{ display: 'flex', flexDirection: config.direction as any, justifyContent: config.justifyContent, alignItems: config.alignItems, flexWrap: config.flexWrap as any, gap: config.gap }}>
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="w-16 h-16 bg-blue-500 rounded-md flex items-center justify-center text-white font-bold">{i}</div>
          ))}
        </div>
        <div className="relative">
          <pre className="rounded-md border border-gray-200 bg-gray-50 p-4 text-sm text-gray-900 whitespace-pre-wrap">{css}</pre>
          <div className="mt-2 flex justify-end"><CopyButton text={css} /></div>
        </div>
      </div>
    </ToolLayout>
  );
}
