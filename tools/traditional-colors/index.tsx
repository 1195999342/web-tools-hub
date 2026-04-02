'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import CopyButton from '../../components/ui/CopyButton';
import Tabs from '../../components/ui/Tabs';
import type { ToolMeta } from '../registry';
import { CHINESE_COLORS, JAPANESE_COLORS, type TraditionalColor } from './logic';

export default function TraditionalColorsTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.traditional-colors');
  const [tab, setTab] = useState('chinese');
  const [selected, setSelected] = useState<TraditionalColor | null>(null);
  const colors = tab === 'chinese' ? CHINESE_COLORS : JAPANESE_COLORS;

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <Tabs tabs={[{ id: 'chinese', label: t('chinese_tab') }, { id: 'japanese', label: t('japanese_tab') }]} activeTab={tab} onTabChange={setTab} />
        {selected && (
          <div className="flex items-center gap-4 p-3 rounded-lg border border-gray-200">
            <div className="w-16 h-16 rounded-lg border border-gray-200" style={{ backgroundColor: selected.hex }} />
            <div>
              <p className="font-bold text-gray-900">{selected.name} {selected.pinyin && <span className="text-gray-500 font-normal">({selected.pinyin})</span>}</p>
              <p className="font-mono text-sm text-gray-600">{selected.hex}</p>
            </div>
            <CopyButton text={selected.hex} />
          </div>
        )}
        <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2">
          {colors.map((c, i) => (
            <button key={i} onClick={() => setSelected(c)} className="w-full aspect-square rounded-lg border border-gray-200 hover:scale-110 transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" style={{ backgroundColor: c.hex }} title={`${c.name} ${c.hex}`} aria-label={`${c.name} ${c.hex}`} />
          ))}
        </div>
      </div>
    </ToolLayout>
  );
}
