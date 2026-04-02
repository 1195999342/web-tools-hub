'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import CopyButton from '../../components/ui/CopyButton';
import type { ToolMeta } from '../registry';
import { toISO8601, toRFC2822, toUnix, toUnixMs, fromISO, timeDiff, convertTimezone, TIMEZONES } from './logic';

export default function TimeConverterTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.time-converter');
  const [input, setInput] = useState(new Date().toISOString());
  const [tz, setTz] = useState('UTC');
  const date = fromISO(input);

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <Input label={t('input_label')} value={input} onChange={e => setInput(e.target.value)} placeholder="2024-01-01T00:00:00Z" />
        <Select label={t('timezone_label')} options={TIMEZONES.map(z => ({ value: z, label: z }))} value={tz} onChange={e => setTz(e.target.value)} />
        {date && (
          <div className="grid grid-cols-1 gap-2">
            {[
              { label: 'ISO 8601', value: toISO8601(date) },
              { label: 'RFC 2822', value: toRFC2822(date) },
              { label: 'Unix (s)', value: String(toUnix(date)) },
              { label: 'Unix (ms)', value: String(toUnixMs(date)) },
              { label: `${tz}`, value: convertTimezone(date, tz) },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-2 rounded border border-gray-200 bg-gray-50 p-2">
                <span className="text-sm font-medium text-gray-600 w-24">{item.label}</span>
                <span className="text-sm font-mono text-gray-900 flex-1">{item.value}</span>
                <CopyButton text={item.value} />
              </div>
            ))}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
