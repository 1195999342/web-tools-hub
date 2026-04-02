'use client';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import type { ToolMeta } from '../registry';
import { extractKeyInfo, type KeyInfo } from './logic';

export default function KeycodeTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.keycode');
  const [info, setInfo] = useState<KeyInfo | null>(null);
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { e.preventDefault(); setInfo(extractKeyInfo(e)); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);
  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col items-center gap-6 py-8">
        <p className="text-gray-500">{t('press_key')}</p>
        {info ? (
          <div className="grid grid-cols-2 gap-4 w-full max-w-md">
            {Object.entries(info).map(([k, v]) => (
              <div key={k} className="rounded border border-gray-200 bg-gray-50 p-3 text-center">
                <p className="text-xs text-gray-500">{k}</p>
                <p className="text-lg font-mono font-bold text-gray-900">{String(v)}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="w-32 h-32 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center">
            <span className="text-4xl text-gray-300">⌨️</span>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
