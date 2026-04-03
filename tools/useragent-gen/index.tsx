'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import CopyButton from '../../components/ui/CopyButton';
import { getBrowserNames, getOSNames, generateUA } from './logic';
import type { ToolMeta } from '../registry';

export default function UseragentGenTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.useragent-gen');
  const [browser, setBrowser] = useState('Chrome');
  const [os, setOs] = useState('Windows');
  const [result, setResult] = useState('');

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <Select label="Browser" options={getBrowserNames().map(b => ({ value: b, label: b }))} value={browser} onChange={e => setBrowser(e.target.value)} />
          <Select label="OS" options={getOSNames().map(o => ({ value: o, label: o }))} value={os} onChange={e => setOs(e.target.value)} />
        </div>
        <Button onClick={() => setResult(generateUA(browser, os))}>Generate User-Agent</Button>
        {result && (
          <div className="relative">
            <pre className="rounded-md border border-gray-200 bg-gray-50 p-4 text-sm text-gray-900 whitespace-pre-wrap break-all">{result}</pre>
            <div className="mt-2 flex justify-end"><CopyButton text={result} /></div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
