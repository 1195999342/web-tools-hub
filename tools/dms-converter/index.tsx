'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Tabs from '../../components/ui/Tabs';
import CopyButton from '../../components/ui/CopyButton';
import type { ToolMeta } from '../registry';
import { decimalToDms, dmsToDecimal } from './logic';

export default function DmsConverterTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.dms-converter');
  const [tab, setTab] = useState('d2dms');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const handleConvert = () => setOutput(tab === 'd2dms' ? decimalToDms(parseFloat(input)) : String(dmsToDecimal(input)));
  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <Tabs tabs={[{ id: 'd2dms', label: t('decimal_to_dms') }, { id: 'dms2d', label: t('dms_to_decimal') }]} activeTab={tab} onTabChange={id => { setTab(id); setInput(''); setOutput(''); }} />
        <Input value={input} onChange={e => setInput(e.target.value)} placeholder={t('input_placeholder')} />
        <Button onClick={handleConvert}>{t('convert_button')}</Button>
        {output && <div className="flex items-center gap-2"><code className="flex-1 rounded border bg-gray-50 p-3 text-sm">{output}</code><CopyButton text={output} /></div>}
      </div>
    </ToolLayout>
  );
}
