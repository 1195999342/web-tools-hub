'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Textarea from '../../components/ui/Textarea';
import type { ToolMeta } from '../../tools/registry';

export interface TextStats {
  chars: number;
  words: number;
  lines: number;
}

export function countStats(text: string): TextStats {
  const chars = [...text].length; // Unicode-aware
  const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
  const lines = text === '' ? 0 : text.split('\n').length;
  return { chars, words, lines };
}

interface WordCounterProps {
  locale: string;
  toolMeta: ToolMeta;
}

export default function WordCounter({ locale, toolMeta }: WordCounterProps) {
  const t = useTranslations('tools.word-counter');
  const [text, setText] = useState('');
  const stats = countStats(text);

  const statItems = [
    { label: t('chars'), value: stats.chars },
    { label: t('words'), value: stats.words },
    { label: t('lines'), value: stats.lines },
  ];

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t('input_placeholder')}
          rows={10}
        />

        <div className="grid grid-cols-3 gap-4">
          {statItems.map(({ label, value }) => (
            <div
              key={label}
              className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center"
            >
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              <p className="text-sm text-gray-500 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </ToolLayout>
  );
}
