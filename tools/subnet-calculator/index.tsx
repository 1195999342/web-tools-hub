'use client';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import CopyButton from '../../components/ui/CopyButton';
import type { ToolMeta } from '../registry';
import { getSubnetTable } from './logic';

export default function SubnetCalculatorTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.subnet-calculator');
  const table = getSubnetTable();
  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-200 px-3 py-2 text-left">CIDR</th>
              <th className="border border-gray-200 px-3 py-2 text-left">{t('mask')}</th>
              <th className="border border-gray-200 px-3 py-2 text-left">{t('wildcard')}</th>
              <th className="border border-gray-200 px-3 py-2 text-right">{t('hosts')}</th>
              <th className="border border-gray-200 px-3 py-2 text-center">{t('class')}</th>
            </tr>
          </thead>
          <tbody>
            {table.map(row => (
              <tr key={row.cidr} className="hover:bg-gray-50">
                <td className="border border-gray-200 px-3 py-1 font-mono">/{row.cidr}</td>
                <td className="border border-gray-200 px-3 py-1 font-mono">{row.mask}</td>
                <td className="border border-gray-200 px-3 py-1 font-mono">{row.wildcard}</td>
                <td className="border border-gray-200 px-3 py-1 font-mono text-right">{row.hosts.toLocaleString()}</td>
                <td className="border border-gray-200 px-3 py-1 text-center">{row.networkClass}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ToolLayout>
  );
}
