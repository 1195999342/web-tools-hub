'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import CopyButton from '../../components/ui/CopyButton';
import type { ToolMeta } from '../registry';
import { GRADIENTS } from './logic';

export default function GradientCollectionTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.gradient-collection');
  const [selected, setSelected] = useState(GRADIENTS[0]);

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        {selected && (
          <div>
            <div className="h-32 rounded-lg mb-2" style={{ background: selected.css.replace(/linear-gradient\(|radial-gradient\(/g, m => m) }} />
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-900">{selected.name}</span>
              <CopyButton text={`background: ${selected.css};`} />
            </div>
          </div>
        )}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {GRADIENTS.map((g, i) => (
            <button key={i} onClick={() => setSelected(g)} className="h-20 rounded-lg border-2 transition-all hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" style={{ background: g.css, borderColor: selected?.name === g.name ? '#3b82f6' : 'transparent' }} aria-label={g.name} title={g.name} />
          ))}
        </div>
      </div>
    </ToolLayout>
  );
}
