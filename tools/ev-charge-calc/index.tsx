'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { calcEVCharge } from './logic';
import type { EVResult } from './logic';
import type { ToolMeta } from '../registry';

export default function EvChargeCalcTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.ev-charge-calc');
  const [capacity, setCapacity] = useState('60');
  const [current, setCurrent] = useState('20');
  const [target, setTarget] = useState('80');
  const [chargerPower, setChargerPower] = useState('7');
  const [price, setPrice] = useState('0.12');
  const [result, setResult] = useState<EVResult | null>(null);

  function handleCalc() {
    const cap = parseFloat(capacity), cur = parseFloat(current), tgt = parseFloat(target);
    const pw = parseFloat(chargerPower), pr = parseFloat(price);
    if ([cap, cur, tgt, pw, pr].some(isNaN) || cur >= tgt || pw <= 0) return;
    setResult(calcEVCharge(cap, cur, tgt, pw, pr));
  }

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <Input label="Battery capacity (kWh)" type="number" value={capacity} onChange={e => setCapacity(e.target.value)} />
          <Input label="Charger power (kW)" type="number" value={chargerPower} onChange={e => setChargerPower(e.target.value)} />
          <Input label="Current charge (%)" type="number" min={0} max={100} value={current} onChange={e => setCurrent(e.target.value)} />
          <Input label="Target charge (%)" type="number" min={0} max={100} value={target} onChange={e => setTarget(e.target.value)} />
          <Input label="Price per kWh ($)" type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} />
        </div>
        <Button onClick={handleCalc}>Calculate</Button>
        {result && (
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-md border border-gray-200 bg-gray-50 p-4 text-center">
              <p className="text-xs text-gray-500">Energy needed</p>
              <p className="text-2xl font-bold text-gray-900">{result.energyNeeded.toFixed(2)} kWh</p>
            </div>
            <div className="rounded-md border border-gray-200 bg-gray-50 p-4 text-center">
              <p className="text-xs text-gray-500">Charge time</p>
              <p className="text-2xl font-bold text-gray-900">{result.timeHours.toFixed(1)} hrs</p>
            </div>
            <div className="rounded-md border border-gray-200 bg-gray-50 p-4 text-center">
              <p className="text-xs text-gray-500">Cost</p>
              <p className="text-2xl font-bold text-gray-900">${result.cost.toFixed(2)}</p>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
