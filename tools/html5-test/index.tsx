'use client';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import type { ToolMeta } from '../registry';
import { getFeatureChecks } from './logic';

export default function Html5TestTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.html5-test');
  const [results, setResults] = useState<{ name: string; category: string; supported: boolean }[]>([]);

  useEffect(() => {
    const checks = getFeatureChecks();
    setResults(checks.map(c => ({ name: c.name, category: c.category, supported: c.check() })));
  }, []);

  const categories = [...new Set(results.map(r => r.category))];
  const supported = results.filter(r => r.supported).length;

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
          <div className="text-3xl font-bold text-blue-600">{supported}/{results.length}</div>
          <div className="text-sm text-gray-600">features supported by your browser</div>
        </div>
        {categories.map(cat => (
          <div key={cat}>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">{cat}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {results.filter(r => r.category === cat).map((r, i) => (
                <div key={i} className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm ${r.supported ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                  <span>{r.supported ? '✅' : '❌'}</span>
                  <span>{r.name}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </ToolLayout>
  );
}
