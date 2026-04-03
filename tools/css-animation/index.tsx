'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import CopyButton from '../../components/ui/CopyButton';
import { presets, getFullCSS, type AnimationPreset } from './logic';
import type { ToolMeta } from '../registry';

export default function CssAnimationTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.css-animation');
  const [selected, setSelected] = useState<AnimationPreset | null>(null);
  const [playKey, setPlayKey] = useState(0);

  function handleSelect(p: AnimationPreset) {
    setSelected(p);
    setPlayKey(k => k + 1);
  }

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {presets.map(p => (
            <button key={p.name} onClick={() => handleSelect(p)} className={`rounded-md border p-3 text-sm font-medium transition-colors hover:bg-blue-50 ${selected?.name === p.name ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
              {p.name}
            </button>
          ))}
        </div>
        {selected && (
          <>
            <div className="flex items-center justify-center h-40 border rounded-md bg-gray-50">
              <div key={playKey} className="w-16 h-16 bg-blue-500 rounded-lg" style={{ animation: selected.css.match(/animation:\s*(.+);/)?.[1] }}>
                <style>{selected.keyframes}</style>
              </div>
            </div>
            <div className="relative">
              <pre className="rounded-md border border-gray-200 bg-gray-900 text-gray-100 p-4 text-sm font-mono whitespace-pre-wrap">{getFullCSS(selected)}</pre>
              <div className="mt-2 flex justify-end"><CopyButton text={getFullCSS(selected)} /></div>
            </div>
          </>
        )}
      </div>
    </ToolLayout>
  );
}
