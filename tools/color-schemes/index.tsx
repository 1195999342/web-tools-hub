'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import CopyButton from '../../components/ui/CopyButton';
import type { ToolMeta } from '../registry';
import { SCHEMES } from './logic';

export default function ColorSchemesTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.color-schemes');
  const [selected, setSelected] = useState(SCHEMES[0]);
  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        {selected && (
          <div className="flex gap-0 h-24 rounded-lg overflow-hidden">
            {selected.colors.map((c, i) => (
              <div key={i} className="flex-1 flex items-end justify-center pb-2" style={{ backgroundColor: c }}>
                <span className="text-xs font-mono bg-white/80 px-1 rounded">{c}</span>
              </div>
            ))}
          </div>
        )}
        {selected && <div className="flex items-center justify-between"><span className="font-medium">{selected.name}</span><CopyButton text={selected.colors.join(', ')} /></div>}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {SCHEMES.map((s, i) => (
            <button key={i} onClick={() => setSelected(s)} className="rounded-lg overflow-hidden border-2 transition-all hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" style={{ borderColor: selected?.name === s.name ? '#3b82f6' : 'transparent' }}>
              <div className="flex h-12">{s.colors.map((c, j) => <div key={j} className="flex-1" style={{ backgroundColor: c }} />)}</div>
              <p className="text-xs text-gray-600 p-1 truncate">{s.name}</p>
            </button>
          ))}
        </div>
      </div>
    </ToolLayout>
  );
}
