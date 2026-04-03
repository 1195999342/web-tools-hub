'use client';
import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import { generateWebSafeColors, getTextColor } from './logic';
import type { ToolMeta } from '../registry';

export default function WebSafeColorsTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.web-safe-colors');
  const colors = useMemo(() => generateWebSafeColors(), []);
  const [copied, setCopied] = useState('');

  function handleCopy(hex: string) {
    navigator.clipboard.writeText(hex).then(() => { setCopied(hex); setTimeout(() => setCopied(''), 1500); });
  }

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        {copied && <p className="text-sm text-green-600">Copied: {copied}</p>}
        <div className="grid grid-cols-12 sm:grid-cols-18 gap-0.5">
          {colors.map(hex => (
            <button key={hex} onClick={() => handleCopy(hex)} title={hex} className="w-full aspect-square rounded-sm text-[8px] font-mono flex items-center justify-center hover:scale-110 transition-transform cursor-pointer" style={{ backgroundColor: hex, color: getTextColor(hex) }}>
              {hex.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </ToolLayout>
  );
}
