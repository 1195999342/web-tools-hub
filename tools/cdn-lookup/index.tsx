'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Input from '../../components/ui/Input';
import CopyButton from '../../components/ui/CopyButton';
import type { ToolMeta } from '../registry';
import { CDN_LIBS, getScriptTag, filterLibs } from './logic';

export default function CdnLookupTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.cdn-lookup');
  const [search, setSearch] = useState('');
  const filtered = filterLibs(CDN_LIBS, search);
  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <Input placeholder="Search libraries (e.g. React, jQuery, Bootstrap)..." value={search} onChange={e => setSearch(e.target.value)} />
        <div className="flex flex-col gap-3">
          {filtered.map((lib, i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="font-semibold text-gray-900">{lib.name}</span>
                  <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">v{lib.version}</span>
                </div>
                <CopyButton text={getScriptTag(lib)} />
              </div>
              <code className="block text-xs bg-gray-50 p-2 rounded font-mono text-gray-700 break-all">{getScriptTag(lib)}</code>
              <div className="mt-1 text-xs text-gray-400 break-all">{lib.cdnUrl}</div>
            </div>
          ))}
          {filtered.length === 0 && <p className="text-center text-gray-400 py-8">No libraries found</p>}
        </div>
      </div>
    </ToolLayout>
  );
}
