'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { getZodiac } from './logic';
import type { ZodiacResult } from './logic';
import type { ToolMeta } from '../registry';

export default function ZodiacTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.zodiac');
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [result, setResult] = useState<ZodiacResult | null>(null);

  function handleCalc() {
    const y = parseInt(year);
    if (isNaN(y)) return;
    setResult(getZodiac(y));
  }

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <div className="flex gap-3 items-end">
          <Input label="Year" type="number" value={year} onChange={e => setYear(e.target.value)} />
          <Button onClick={handleCalc}>Lookup</Button>
        </div>
        {result && (
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-md border border-gray-200 bg-gray-50 p-4 text-center">
              <p className="text-xs text-gray-500">Zodiac Animal</p>
              <p className="text-2xl font-bold text-gray-900">{result.animal}</p>
            </div>
            <div className="rounded-md border border-gray-200 bg-gray-50 p-4 text-center">
              <p className="text-xs text-gray-500">Element</p>
              <p className="text-2xl font-bold text-gray-900">{result.element}</p>
            </div>
            <div className="rounded-md border border-gray-200 bg-gray-50 p-4 text-center">
              <p className="text-xs text-gray-500">Heavenly Stem</p>
              <p className="text-lg font-semibold text-gray-900">{result.heavenlyStem}</p>
            </div>
            <div className="rounded-md border border-gray-200 bg-gray-50 p-4 text-center">
              <p className="text-xs text-gray-500">Earthly Branch</p>
              <p className="text-lg font-semibold text-gray-900">{result.earthlyBranch}</p>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
