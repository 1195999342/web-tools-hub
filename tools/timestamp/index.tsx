'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import CopyButton from '../../components/ui/CopyButton';
import Select from '../../components/ui/Select';
import { timestampToDate, dateToTimestamp, getCurrentTimestamp, formatDateForTimezone, type TimestampUnit } from './logic';
import type { ToolMeta } from '../../tools/registry';

interface TimestampProps {
  locale: string;
  toolMeta: ToolMeta;
}

const TIMEZONES = [
  'UTC', 'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles',
  'Europe/London', 'Europe/Paris', 'Europe/Berlin', 'Asia/Tokyo', 'Asia/Shanghai',
  'Asia/Kolkata', 'Australia/Sydney', 'Pacific/Auckland',
];

export default function TimestampTool({ locale, toolMeta }: TimestampProps) {
  const t = useTranslations('tools.timestamp');
  const [currentTs, setCurrentTs] = useState(getCurrentTimestamp());
  const [tsInput, setTsInput] = useState('');
  const [unit, setUnit] = useState<TimestampUnit>('seconds');
  const [timezone, setTimezone] = useState('UTC');
  const [tsResult, setTsResult] = useState('');
  const [tsError, setTsError] = useState('');
  const [dateInput, setDateInput] = useState('');
  const [dateResult, setDateResult] = useState('');
  const [dateError, setDateError] = useState('');

  useEffect(() => {
    const interval = setInterval(() => setCurrentTs(getCurrentTimestamp()), 1000);
    return () => clearInterval(interval);
  }, []);

  const unitOptions = [
    { value: 'seconds', label: t('seconds') },
    { value: 'milliseconds', label: t('milliseconds') },
  ];

  const tzOptions = TIMEZONES.map((tz) => ({ value: tz, label: tz }));

  function handleTsToDate() {
    setTsError('');
    setTsResult('');
    const num = Number(tsInput);
    if (isNaN(num)) { setTsError(t('error_invalid_ts')); return; }
    const r = formatDateForTimezone(num, unit, timezone);
    if (r.error) setTsError(t('error_invalid_ts'));
    else setTsResult(r.output ?? '');
  }

  function handleDateToTs() {
    setDateError('');
    setDateResult('');
    const r = dateToTimestamp(dateInput, unit);
    if (r.error) setDateError(t('error_invalid_date'));
    else setDateResult(String(r.output ?? ''));
  }

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-6">
        {/* Current timestamp */}
        <div className="rounded-md border border-blue-200 bg-blue-50 p-4">
          <p className="text-sm font-medium text-blue-800 mb-1">{t('current_ts')}</p>
          <div className="flex items-center gap-4">
            <span className="text-lg font-mono text-blue-900">{currentTs.seconds}</span>
            <span className="text-sm text-blue-600">({t('seconds')})</span>
            <CopyButton text={String(currentTs.seconds)} />
          </div>
        </div>

        <div className="flex gap-4 flex-col sm:flex-row">
          <Select label={t('unit_label')} options={unitOptions} value={unit}
            onChange={(e) => setUnit(e.target.value as TimestampUnit)} />
          <Select label={t('timezone_label')} options={tzOptions} value={timezone}
            onChange={(e) => setTimezone(e.target.value)} />
        </div>

        {/* Timestamp to Date */}
        <section className="flex flex-col gap-3">
          <h3 className="text-lg font-semibold text-gray-800">{t('ts_to_date')}</h3>
          <Input value={tsInput} onChange={(e) => setTsInput(e.target.value)}
            placeholder={t('ts_placeholder')} />
          <Button onClick={handleTsToDate}>{t('convert_button')}</Button>
          {tsError && <p className="text-sm text-red-600" role="alert">{tsError}</p>}
          {tsResult && (
            <div className="flex items-center gap-2">
              <code className="rounded bg-gray-100 px-3 py-2 text-sm">{tsResult}</code>
              <CopyButton text={tsResult} />
            </div>
          )}
        </section>

        {/* Date to Timestamp */}
        <section className="flex flex-col gap-3">
          <h3 className="text-lg font-semibold text-gray-800">{t('date_to_ts')}</h3>
          <Input type="datetime-local" value={dateInput}
            onChange={(e) => setDateInput(e.target.value)} />
          <Button onClick={handleDateToTs}>{t('convert_button')}</Button>
          {dateError && <p className="text-sm text-red-600" role="alert">{dateError}</p>}
          {dateResult && (
            <div className="flex items-center gap-2">
              <code className="rounded bg-gray-100 px-3 py-2 text-sm">{dateResult}</code>
              <CopyButton text={dateResult} />
            </div>
          )}
        </section>
      </div>
    </ToolLayout>
  );
}
