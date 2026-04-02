'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import CopyButton from '../../components/ui/CopyButton';
import Select from '../../components/ui/Select';
import type { ToolMeta } from '../registry';
import { generateHarmony, RULES, type HarmonyRule } from './logic';

export default function ColorPaletteTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.color-palette');
  const [color, setColor] = useState('#3b82f6');
  const [rule, setRule] = useState<HarmonyRule>('complementary');
  const colors = generateHarmony(color, rule);

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-12 h-12 rounded border border-gray-300 cursor-pointer" aria-label={t('color_label')} />
          <span className="font-mono text-gray-700">{color}</span>
        </div>
        <Select label={t('rule_label')} options={RULES.map(r => ({ value: r, label: t(`rule_${r}`) }))} value={rule} onChange={e => setRule(e.target.value as HarmonyRule)} />
        <div className="flex gap-2 h-32">
          {colors.map((c, i) => (
            <div key={i} className="flex-1 rounded-lg flex flex-col items-center justify-end pb-2" style={{ backgroundColor: c }}>
              <span className="text-xs font-mono bg-white/80 px-1 rounded">{c}</span>
            </div>
          ))}
        </div>
        <CopyButton text={colors.join(', ')} />
      </div>
    </ToolLayout>
  );
}
