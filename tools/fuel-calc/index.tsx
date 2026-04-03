'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { calcFuelConsumption } from './logic';
import type { ToolMeta } from '../registry';

export default function FuelCalcTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.fuel-calc');
  const [distance, setDistance] = useState('');
  const [fuel, setFuel] = useState('');
  const [result, setResult] = useState<{ lPer100km: number; mpg: number; kmPerLiter: number } | null>(null);

  function handleCalc() {
    const d = parseFloat(distance), f = parseFloat(fuel);
    if (isNaN(d) || isNaN(f) || d <= 0 || f <= 0) return;
    setResult(calcFuelConsumption(d, f));
  }

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <Input label="Distance (km)" type="number" value={distance} onChange={e => setDistance(e.target.value)} />
          <Input label="Fuel used (liters)" type="number" value={fuel} onChange={e => setFuel(e.target.value)} />
        </div>
        <Button onClick={handleCalc}>Calculate</Button>
        {result && (
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-md border border-gray-200 bg-gray-50 p-4 text-center">
              <p className="text-xs text-gray-500">L/100km</p>
              <p className="text-2xl font-bold text-gray-900">{result.lPer100km.toFixed(2)}</p>
            </div>
            <div className="rounded-md border border-gray-200 bg-gray-50 p-4 text-center">
              <p className="text-xs text-gray-500">MPG</p>
              <p className="text-2xl font-bold text-gray-900">{result.mpg.toFixed(2)}</p>
            </div>
            <div className="rounded-md border border-gray-200 bg-gray-50 p-4 text-center">
              <p className="text-xs text-gray-500">km/L</p>
              <p className="text-2xl font-bold text-gray-900">{result.kmPerLiter.toFixed(2)}</p>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
