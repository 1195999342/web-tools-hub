'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Textarea from '../../components/ui/Textarea';
import CopyButton from '../../components/ui/CopyButton';
import { convertNaming, type NamingStyle } from './logic';
import type { ToolMeta } from '../../tools/registry';

const STYLES: { value: NamingStyle; label: string }[] = [
  { value: 'camel', label: 'camelCase' },
  { value: 'pascal', label: 'PascalCase' },
  { value: 'snake', label: 'snake_case' },
  { value: 'kebab', label: 'kebab-case' },
  { value: 'screaming', label: 'SCREAMING_SNAKE' },
];

export default function NamingConverterTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.naming-converter');
  const [input, setInput] = useState('');

  const results = STYLES.map((s) => ({
    ...s,
    result: input ? (convertNaming(input, s.value).output ?? '') : '',
  }));

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <Textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder={t('input_placeholder')} rows={3} />
        <div className="grid gap-3">
          {results.map((r) => (
            <div key={r.value} className="flex items-center gap-3 rounded-md border border-gray-200 bg-gray-50 p-3">
              <span className="text-sm font-medium text-gray-600 w-40">{r.label}</span>
              <code className="flex-1 text-sm text-gray-900 break-all">{r.result}</code>
              {r.result && <CopyButton text={r.result} />}
            </div>
          ))}
        </div>
      </div>
    </ToolLayout>
  );
}
