'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import CopyButton from '../../components/ui/CopyButton';
import type { ToolMeta } from '../registry';
import { getBrowserInfo, type BrowserData } from './logic';

export default function BrowserInfoTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.browser-info');
  const [info, setInfo] = useState<BrowserData | null>(null);
  useEffect(() => { setInfo(getBrowserInfo()); }, []);

  if (!info) return null;
  const entries = Object.entries(info).map(([k, v]) => ({ key: k, value: Array.isArray(v) ? v.join(', ') : String(v) }));
  const allText = entries.map(e => `${e.key}: ${e.value}`).join('\n');

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-2">
        {entries.map(e => (
          <div key={e.key} className="flex items-center gap-2 rounded border border-gray-200 bg-gray-50 p-2">
            <span className="text-sm font-medium text-gray-600 w-40">{e.key}</span>
            <span className="text-sm font-mono text-gray-900 flex-1 break-all">{e.value}</span>
          </div>
        ))}
        <div className="flex justify-end"><CopyButton text={allText} /></div>
      </div>
    </ToolLayout>
  );
}
