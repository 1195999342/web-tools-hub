'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Input from '../../components/ui/Input';
import CopyButton from '../../components/ui/CopyButton';
import { filterUAs } from './logic';
import type { ToolMeta } from '../registry';

export default function UseragentListTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.useragent-list');
  const [search, setSearch] = useState('');
  const results = filterUAs(search);

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <Input placeholder="Search by browser, OS, or UA string..." value={search} onChange={e => setSearch(e.target.value)} />
        <div className="overflow-x-auto border rounded-md">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-3 py-2 text-left font-medium text-gray-700">Browser</th>
                <th className="px-3 py-2 text-left font-medium text-gray-700">OS</th>
                <th className="px-3 py-2 text-left font-medium text-gray-700">User-Agent</th>
                <th className="px-3 py-2 text-right font-medium text-gray-700">Copy</th>
              </tr>
            </thead>
            <tbody>
              {results.map((entry, i) => (
                <tr key={i} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-3 py-2 whitespace-nowrap">{entry.browser}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{entry.os}</td>
                  <td className="px-3 py-2 text-xs font-mono break-all max-w-md">{entry.ua}</td>
                  <td className="px-3 py-2 text-right"><CopyButton text={entry.ua} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ToolLayout>
  );
}
