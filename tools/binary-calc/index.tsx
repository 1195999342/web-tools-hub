'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import CopyButton from '../../components/ui/CopyButton';
import { binaryCalc } from './logic';
import type { BinOp } from './logic';
import type { ToolMeta } from '../registry';

export default function BinaryCalcTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.binary-calc');
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [op, setOp] = useState<BinOp>('AND');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  function handleCalc() {
    setError(''); setResult('');
    const r = binaryCalc(a, b, op);
    if (r === null) { setError('Invalid binary input'); return; }
    setResult(r);
  }

  const ops = [{value:'AND',label:'AND'},{value:'OR',label:'OR'},{value:'XOR',label:'XOR'},{value:'NOT_A',label:'NOT A'},{value:'+',label:'+'},{value:'-',label:'-'},{value:'*',label:'×'}];

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <Input label="Binary A" value={a} onChange={e => setA(e.target.value)} placeholder="1010" />
        <Select label="Operation" options={ops} value={op} onChange={e => setOp(e.target.value as BinOp)} />
        {op !== 'NOT_A' && <Input label="Binary B" value={b} onChange={e => setB(e.target.value)} placeholder="1100" />}
        <Button onClick={handleCalc}>Calculate</Button>
        {error && <p className="text-sm text-red-600">{error}</p>}
        {result && (
          <div className="relative">
            <div className="rounded-md border border-gray-200 bg-gray-50 p-4 font-mono text-lg text-gray-900">{result}</div>
            <div className="mt-2 flex justify-end"><CopyButton text={result} /></div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
