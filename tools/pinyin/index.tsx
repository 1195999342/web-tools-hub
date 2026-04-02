'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Textarea from '../../components/ui/Textarea';
import Select from '../../components/ui/Select';
import CopyButton from '../../components/ui/CopyButton';
import type { ToolMeta } from '../registry';
import { toPinyin, type ToneMode } from './logic';

export default function PinyinTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.pinyin');
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<ToneMode>('marks');
  const output = toPinyin(input, mode);

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <Textarea value={input} onChange={e => setInput(e.target.value)} placeholder={t('input_placeholder')} rows={4} />
        <Select label={t('mode_label')} options={[{ value: 'marks', label: t('mode_marks') }, { value: 'numbers', label: t('mode_numbers') }, { value: 'none', label: t('mode_none') }]} value={mode} onChange={e => setMode(e.target.value as ToneMode)} />
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
