'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import CopyButton from '../../components/ui/CopyButton';
import { getEDigits } from './logic';
import type { ToolMeta } from '../registry';

export default function EulerETool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.euler-e');
  const [digits, setDigits] = useState('50');
  const [eStr, setEStr] = useState('');

  function handleShow() {
    const n = parseInt(digits);
    if (isNaN(n) || n < 1 || n > 200) return;
    setEStr(getEDigits(n));
  }

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <div className="flex gap-3 items-end">
          <Input label="Digits of e (max 200)" type="number" min={1} max={200} value={digits} onChange={e => setDigits(e.target.value)} />
          <Button onClick={handleShow}>Show</Button>
        </div>
        {eStr && (
          <div className="relative">
            <pre className="rounded-md border border-gray-200 bg-gray-50 p-4 overflow-auto text-sm text-gray-900 whitespace-pre-wrap break-all font-mono">
              {eStr}
            </pre>
            <div className="mt-2 flex justify-end"><CopyButton text={eStr} /></div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
