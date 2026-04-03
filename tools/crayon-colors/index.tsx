'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import type { ToolMeta } from '../registry';
import { CRAYON_COLORS } from './logic';

export default function CrayonColorsTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.crayon-colors');
  const [copied, setCopied] = useState('');

  function handleCopy(hex: string) {
    navigator.clipboard.writeText(hex).catch(() => {});
    setCopied(hex);
    setTimeout(() => setCopied(''), 1500);
  }

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
        {CRAYON_COLORS.map((c, i) => (
          <button
            key={i}
            onClick={() => handleCopy(c.hex)}
            className="flex flex-col items-center gap-1 p-2 rounded-lg border border-gray-200 hover:border-blue-400 transition-colors cursor-pointer group"
            title={`${c.name} - ${c.hex}`}
          >
            <div
              className="w-10 h-10 rounded-full border border-gray-300 group-hover:scale-110 transition-transform"
              style={{ backgroundColor: c.hex }}
            />
            <span className="text-[10px] text-gray-600 leading-tight text-center">{c.name}</span>
            <span className="text-[10px] font-mono text-gray-400">{copied === c.hex ? '✓' : c.hex}</span>
          </button>
        ))}
      </div>
    </ToolLayout>
  );
}
