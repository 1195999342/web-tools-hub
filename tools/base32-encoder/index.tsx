'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Textarea from '../../components/ui/Textarea';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import Tabs from '../../components/ui/Tabs';
import CopyButton from '../../components/ui/CopyButton';
import type { ToolMeta } from '../registry';
import { base32Encode, base32Decode, base58Encode, base58Decode, base62Encode, base62Decode } from './logic';

const encoders: Record<string, (s: string) => string> = { base32: base32Encode, base58: base58Encode, base62: base62Encode };
const decoders: Record<string, (s: string) => string> = { base32: base32Decode, base58: base58Decode, base62: base62Decode };

export default function Base32EncoderTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.base32-encoder');
  const [tab, setTab] = useState('encode');
  const [algo, setAlgo] = useState('base32');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const handleAction = () => {
    try {
      setError('');
      setOutput(tab === 'encode' ? encoders[algo](input) : decoders[algo](input));
    } catch (e) { setError((e as Error).message); setOutput(''); }
  };

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <Tabs tabs={[{ id: 'encode', label: t('encode_tab') }, { id: 'decode', label: t('decode_tab') }]} activeTab={tab} onTabChange={id => { setTab(id); setInput(''); setOutput(''); setError(''); }} />
        <Select label={t('algo_label')} options={[{ value: 'base32', label: 'Base32' }, { value: 'base58', label: 'Base58' }, { value: 'base62', label: 'Base62' }]} value={algo} onChange={e => setAlgo(e.target.value)} />
        <Textarea value={input} onChange={e => setInput(e.target.value)} placeholder={t('input_placeholder')} rows={6} />
        <Button onClick={handleAction}>{tab === 'encode' ? t('encode_tab') : t('decode_tab')}</Button>
        {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
        {output && <div className="relative"><pre className="rounded-md border border-gray-200 bg-gray-50 p-4 text-sm whitespace-pre-wrap break-all">{output}</pre><div className="mt-2 flex justify-end"><CopyButton text={output} /></div></div>}
      </div>
    </ToolLayout>
  );
}
