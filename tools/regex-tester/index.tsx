'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import { testRegex } from './logic';
import type { ToolMeta } from '../../tools/registry';

interface Props { locale: string; toolMeta: ToolMeta; }

const FLAGS = ['g', 'i', 'm', 's'] as const;

export default function RegexTesterTool({ locale, toolMeta }: Props) {
  const t = useTranslations('tools.regex-tester');
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState<Set<string>>(new Set(['g']));
  const [text, setText] = useState('');

  const flagStr = Array.from(flags).join('');
  const result = useMemo(() => testRegex(pattern, flagStr, text), [pattern, flagStr, text]);

  function toggleFlag(f: string) {
    setFlags((prev) => {
      const next = new Set(prev);
      if (next.has(f)) next.delete(f); else next.add(f);
      return next;
    });
  }

  // Build highlighted text
  const highlighted = useMemo(() => {
    if (!result.matches.length || !text) return null;
    const parts: { text: string; match: boolean }[] = [];
    let lastIndex = 0;
    for (const m of result.matches) {
      if (m.index > lastIndex) parts.push({ text: text.slice(lastIndex, m.index), match: false });
      parts.push({ text: m.match, match: true });
      lastIndex = m.index + m.match.length;
    }
    if (lastIndex < text.length) parts.push({ text: text.slice(lastIndex), match: false });
    return parts;
  }, [result.matches, text]);

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <Input
          label={t('pattern_label')}
          value={pattern}
          onChange={(e) => setPattern(e.target.value)}
          placeholder={t('pattern_placeholder')}
          className="font-mono"
        />
        <div className="flex flex-wrap items-center gap-3">
          {FLAGS.map((f) => (
            <label key={f} className="flex items-center gap-1.5 text-sm cursor-pointer">
              <input type="checkbox" checked={flags.has(f)} onChange={() => toggleFlag(f)} className="w-4 h-4 accent-blue-600" />
              {f}
            </label>
          ))}
        </div>
        <Textarea
          label={t('text_label')}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t('text_placeholder')}
          rows={6}
        />
        {result.error && <p className="text-sm text-red-600" role="alert">{result.error}</p>}
        {highlighted && (
          <div className="rounded-md border border-gray-200 bg-gray-50 p-4 text-sm whitespace-pre-wrap break-all">
            {highlighted.map((part, i) =>
              part.match ? (
                <mark key={i} className="bg-yellow-200 rounded px-0.5">{part.text}</mark>
              ) : (
                <span key={i}>{part.text}</span>
              ),
            )}
          </div>
        )}
        {result.matches.length > 0 && (
          <div className="text-sm text-gray-600">
            {t('match_count', { count: result.matches.length })}
            <div className="mt-2 flex flex-col gap-1">
              {result.matches.slice(0, 50).map((m, i) => (
                <div key={i} className="font-mono text-xs text-gray-700">
                  [{m.index}] &quot;{m.match}&quot;{m.groups.length > 0 && ` → groups: ${m.groups.join(', ')}`}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
