'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Textarea from '../../components/ui/Textarea';
import Toggle from '../../components/ui/Toggle';
import CopyButton from '../../components/ui/CopyButton';
import { computeHash, type HashAlgorithm } from './logic';
import type { ToolMeta } from '../../tools/registry';

interface Props { locale: string; toolMeta: ToolMeta; }

const ALGORITHMS: HashAlgorithm[] = ['MD5', 'SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'];

export default function HashCalculatorTool({ locale, toolMeta }: Props) {
  const t = useTranslations('tools.hash-calculator');
  const [input, setInput] = useState('');
  const [selected, setSelected] = useState<Set<HashAlgorithm>>(new Set(['MD5', 'SHA-256']));
  const [results, setResults] = useState<Record<string, string>>({});
  const [uppercase, setUppercase] = useState(false);

  const compute = useCallback(async () => {
    if (!input) { setResults({}); return; }
    const entries: Record<string, string> = {};
    for (const algo of Array.from(selected)) {
      entries[algo] = await computeHash(input, algo);
    }
    setResults(entries);
  }, [input, selected]);

  useEffect(() => { compute(); }, [compute]);

  function toggleAlgo(algo: HashAlgorithm) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(algo)) next.delete(algo); else next.add(algo);
      return next;
    });
  }

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('input_placeholder')}
          rows={4}
        />
        <div className="flex flex-wrap items-center gap-3">
          {ALGORITHMS.map((algo) => (
            <label key={algo} className="flex items-center gap-1.5 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={selected.has(algo)}
                onChange={() => toggleAlgo(algo)}
                className="w-4 h-4 accent-blue-600"
              />
              {algo}
            </label>
          ))}
          <Toggle label={t('uppercase_label')} checked={uppercase} onChange={setUppercase} />
        </div>
        {Object.keys(results).length > 0 && (
          <div className="flex flex-col gap-3">
            {Object.entries(results).map(([algo, hash]) => (
              <div key={algo} className="rounded-md border border-gray-200 bg-gray-50 p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-gray-500">{algo}</span>
                  <CopyButton text={uppercase ? hash.toUpperCase() : hash} />
                </div>
                <code className="text-sm text-gray-900 break-all">
                  {uppercase ? hash.toUpperCase() : hash}
                </code>
              </div>
            ))}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
