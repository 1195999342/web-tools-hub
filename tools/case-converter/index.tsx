'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Textarea from '../../components/ui/Textarea';
import Button from '../../components/ui/Button';
import CopyButton from '../../components/ui/CopyButton';
import { convertCase, type CaseMode } from './logic';
import type { ToolMeta } from '../../tools/registry';

interface Props { locale: string; toolMeta: ToolMeta; }

const MODES: CaseMode[] = ['upper', 'lower', 'title', 'sentence', 'toggle'];

export default function CaseConverterTool({ locale, toolMeta }: Props) {
  const t = useTranslations('tools.case-converter');
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<CaseMode>('upper');

  const output = useMemo(() => convertCase(input, mode), [input, mode]);

  const modeLabels: Record<CaseMode, string> = {
    upper: t('mode_upper'),
    lower: t('mode_lower'),
    title: t('mode_title'),
    sentence: t('mode_sentence'),
    toggle: t('mode_toggle'),
  };

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('input_placeholder')}
          rows={4}
        />
        <div className="flex flex-wrap gap-2">
          {MODES.map((m) => (
            <Button
              key={m}
              variant={mode === m ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setMode(m)}
            >
              {modeLabels[m]}
            </Button>
          ))}
        </div>
        {output && (
          <div className="relative">
            <pre className="rounded-md border border-gray-200 bg-gray-50 p-4 overflow-auto text-sm text-gray-900 whitespace-pre-wrap break-all">
              <code>{output}</code>
            </pre>
            <div className="mt-2 flex justify-end">
              <CopyButton text={output} />
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
