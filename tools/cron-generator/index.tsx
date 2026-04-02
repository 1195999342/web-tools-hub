'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Input from '../../components/ui/Input';
import CopyButton from '../../components/ui/CopyButton';
import { parseCron, buildCron, describeCron, getNextRuns, type CronParts } from './logic';
import type { ToolMeta } from '../../tools/registry';

export default function CronGeneratorTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.cron-generator');
  const [parts, setParts] = useState<CronParts>({ minute: '0', hour: '*', dayOfMonth: '*', month: '*', dayOfWeek: '*' });
  const [rawInput, setRawInput] = useState('');

  const expr = buildCron(parts);
  const description = describeCron(expr);
  const nextRuns = getNextRuns(expr, 5);

  function handleRawChange(value: string) {
    setRawInput(value);
    const parsed = parseCron(value);
    if (parsed) setParts(parsed);
  }

  function updatePart(key: keyof CronParts, value: string) {
    setParts((prev) => ({ ...prev, [key]: value }));
    setRawInput('');
  }

  const fields: { key: keyof CronParts; label: string }[] = [
    { key: 'minute', label: t('minute') },
    { key: 'hour', label: t('hour') },
    { key: 'dayOfMonth', label: t('day_of_month') },
    { key: 'month', label: t('month') },
    { key: 'dayOfWeek', label: t('day_of_week') },
  ];

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <Input label={t('expression_label')} value={rawInput || expr} onChange={(e) => handleRawChange(e.target.value)} placeholder="* * * * *" />
        <div className="grid grid-cols-5 gap-3">
          {fields.map((f) => (
            <Input key={f.key} label={f.label} value={parts[f.key]} onChange={(e) => updatePart(f.key, e.target.value)} />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <code className="text-lg font-mono font-bold text-blue-600">{expr}</code>
          <CopyButton text={expr} />
        </div>
        <p className="text-sm text-gray-700">{description}</p>
        {nextRuns.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">{t('next_runs')}</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              {nextRuns.map((r, i) => <li key={i} className="font-mono">{r}</li>)}
            </ul>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
