'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import { getPossibleChildTypes } from './logic';
import type { ToolMeta } from '../registry';

const TYPES = [{value:'A',label:'A'},{value:'B',label:'B'},{value:'AB',label:'AB'},{value:'O',label:'O'}];

export default function BloodTypeTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.blood-type');
  const [father, setFather] = useState('A');
  const [mother, setMother] = useState('B');
  const [result, setResult] = useState<string[]>([]);

  function handleCalc() {
    setResult(getPossibleChildTypes(father as any, mother as any));
  }

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <Select label="Father's blood type" options={TYPES} value={father} onChange={e => setFather(e.target.value)} />
          <Select label="Mother's blood type" options={TYPES} value={mother} onChange={e => setMother(e.target.value)} />
        </div>
        <Button onClick={handleCalc}>Calculate</Button>
        {result.length > 0 && (
          <div className="rounded-md border border-gray-200 bg-gray-50 p-4 text-center">
            <p className="text-sm text-gray-500 mb-2">Possible child blood types</p>
            <div className="flex gap-3 justify-center">
              {result.map(bt => (
                <span key={bt} className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-100 text-red-700 font-bold text-xl">{bt}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
