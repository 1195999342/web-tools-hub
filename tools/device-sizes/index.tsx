'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Input from '../../components/ui/Input';
import Tabs from '../../components/ui/Tabs';
import type { ToolMeta } from '../registry';
import { DEVICES, filterDevices } from './logic';

export default function DeviceSizesTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.device-sizes');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'iphone', label: 'iPhone' },
    { id: 'ipad', label: 'iPad' },
    { id: 'android', label: 'Android' },
  ];
  const filtered = filterDevices(DEVICES, search, category);
  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <Input placeholder="Search devices..." value={search} onChange={e => setSearch(e.target.value)} />
        <Tabs tabs={tabs} activeTab={category} onTabChange={setCategory} />
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="px-3 py-2 border border-gray-200 font-medium">Device</th>
                <th className="px-3 py-2 border border-gray-200 font-medium">Brand</th>
                <th className="px-3 py-2 border border-gray-200 font-medium">Screen</th>
                <th className="px-3 py-2 border border-gray-200 font-medium">Resolution</th>
                <th className="px-3 py-2 border border-gray-200 font-medium">PPI</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((d, i) => (
                <tr key={i} className="hover:bg-blue-50">
                  <td className="px-3 py-2 border border-gray-200">{d.name}</td>
                  <td className="px-3 py-2 border border-gray-200">{d.brand}</td>
                  <td className="px-3 py-2 border border-gray-200">{d.screenSize}</td>
                  <td className="px-3 py-2 border border-gray-200 font-mono">{d.resolution}</td>
                  <td className="px-3 py-2 border border-gray-200 font-mono">{d.ppi}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="px-3 py-8 text-center text-gray-400 border border-gray-200">No devices found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </ToolLayout>
  );
}
