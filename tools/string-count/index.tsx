'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Textarea from '../../components/ui/Textarea';
import Input from '../../components/ui/Input';
import Toggle from '../../components/ui/Toggle';
import type { ToolMeta } from '../registry';
import { countOccurrences } from './logic';

export default function StringCountTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.string-count');
  const [input, setInput] = useState('');
  const [search, setSearch] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(false);
  const count = countOccurrences(input, search, caseSensitive);
  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <Textarea value={input} onChange={e => setInput(e.target.value)} placeholder={t('input_placeholder')} rows={6} />
        <Input label={t('search_label')} value={search} onChange={e => setSearch(e.target.value)} />
        <Toggle label={t('case_label')} checked={caseSensitive} onChange={setCaseSensitive} />
        {search && <p className="text-lg font-semibold">{t('count_label')}: {count}</p>}
      </div>
    </ToolLayout>
  );
}
