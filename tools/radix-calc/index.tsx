'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import { parseNumber, calc, toAllBases } from './logic';
import type { Op } from './logic';
import type { ToolMeta } from '../registry';

export default function RadixCalcTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.radix-calc');
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [op, setOp] = useState<Op>('+');
  const [radix, setRadix] = useState('10');
  const [result, setResult] = useState<ReturnType<typeof toAllBases> | null>(null);
  const [error, setError] = useState('');

  function handleCalc() {
    setError(''); setResult(null);
    const r = parseInt(radix);
    const na = parseNumber(a, r), nb = parseNumber(b, r);
    if (na === null || nb === null) { setError('Invalid number for selected base'); return; }
    const res = calc(na, nb, op);
    if (res === null) { setError('Division by zero'); return; }
    setResult(toAllBases(res));
  }

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <Select label="Input Base" options={[{value:'2',label:'Binary (2)'},{value:'8',label:'Octal (8)'},{value:'10',label:'Decimal (10)'},{value:'16',label:'Hex (16)'}]} value={radix} onChange={e => setRadix(e.target.value)} />
        <div className="flex gap-3 items-end">
          <Input label="Number A" value={a} onChange={e => setA(e.target.value)} />
          <Select label="Operator" options={[{value:'+',label:'+'},{value:'-',label:'-'},{value:'*',label:'×'},{value:'/',label:'÷'},{value:'%',label:'%'}]} value={op} onChange={e => setOp(e.target.value as Op)} />
          <Input label="Number B" value={b} onChange={e => setB(e.target.value)} />
        </div>
        <Button onClick={handleCalc}>Calculate</Button>
        {error && <p className="text-sm text-red-600">{error}</p>}
        {result && (
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(result).map(([base, val]) => (
              <div key={base} className="rounded-md border border-gray-200 bg-gray-50 p-3">
                <p className="text-xs text-gray-500 uppercase">{base}</p>
                <p className="text-lg font-mono font-semibold text-gray-900">{val}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
