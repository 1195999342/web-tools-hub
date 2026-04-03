'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Input from '../../components/ui/Input';
import Tabs from '../../components/ui/Tabs';
import type { ToolMeta } from '../registry';
import { VSCODE_SHORTCUTS, DEVTOOLS_SHORTCUTS, filterShortcuts } from './logic';

export default function ShortcutRefTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.shortcut-ref');
  const [tab, setTab] = useState('vscode');
  const [search, setSearch] = useState('');
  const tabs = [
    { id: 'vscode', label: 'VS Code' },
    { id: 'devtools', label: 'Chrome DevTools' },
  ];
  const list = filterShortcuts(tab === 'vscode' ? VSCODE_SHORTCUTS : DEVTOOLS_SHORTCUTS, search);
  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <Tabs tabs={tabs} activeTab={tab} onTabChange={id => { setTab(id); setSearch(''); }} />
        <Input placeholder="Search shortcuts..." value={search} onChange={e => setSearch(e.target.value)} />
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="px-3 py-2 border border-gray-200 font-medium w-1/3">Shortcut</th>
                <th className="px-3 py-2 border border-gray-200 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {list.map((s, i) => (
                <tr key={i} className="hover:bg-blue-50">
                  <td className="px-3 py-2 border border-gray-200"><kbd className="bg-gray-200 px-2 py-0.5 rounded text-xs font-mono">{s.keys}</kbd></td>
                  <td className="px-3 py-2 border border-gray-200">{s.action}</td>
                </tr>
              ))}
              {list.length === 0 && (
                <tr><td colSpan={2} className="px-3 py-8 text-center text-gray-400 border border-gray-200">No shortcuts found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </ToolLayout>
  );
}
