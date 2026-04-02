'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Textarea from '../../components/ui/Textarea';
import Toggle from '../../components/ui/Toggle';
import CopyButton from '../../components/ui/CopyButton';
import type { ToolMeta } from '../registry';
import { filterText, type FilterOptions } from './logic';

export default function TextFilterTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.text-filter');
  const [input, setInput] = useState('');
  const [opts, setOpts] = useState<FilterOptions>({ keepChinese: true, keepEnglish: true, keepDigits: true, keepPunctuation: false, keepSpaces: true });
  const output = filterText(input, opts);
  const toggle = (key: keyof FilterOptions) => setOpts(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <Textarea value={input} onChange={e => setInput(e.target.value)} placeholder={t('input_placeholder')} rows={6} />
        <div className="flex flex-wrap gap-4">
          <Toggle label={t('keep_chinese')} checked={opts.keepChinese} onChange={() => toggle('keepChinese')} />
          <Toggle label={t('keep_english')} checked={opts.keepEnglish} onChange={() => toggle('keepEnglish')} />
          <Toggle label={t('keep_digits')} checked={opts.keepDigits} onChange={() => toggle('keepDigits')} />
          <Toggle label={t('keep_punctuation')} checked={opts.keepPunctuation} onChange={() => toggle('keepPunctuation')} />
          <Toggle label={t('keep_spaces')} checked={opts.keepSpaces} onChange={() => toggle('keepSpaces')} />
        </div>
        {output && (
          <div className="relative">
            <pre className="rounded-md border border-gray-200 bg-gray-50 p-4 text-sm text-gray-900 whitespace-pre-wrap">{output}</pre>
            <div className="mt-2 flex justify-end"><CopyButton text={output} /></div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
