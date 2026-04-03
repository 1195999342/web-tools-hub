'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import { calcVelocity, calcFrequency, calcDisplacement } from './logic';
import type { ToolMeta } from '../registry';

export default function VibrationCalcTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.vibration-calc');
  const [mode, setMode] = useState('velocity');
  const [velocity, setVelocity] = useState('');
  const [frequency, setFrequency] = useState('');
  const [displacement, setDisplacement] = useState('');
  const [result, setResult] = useState('');

  function handleCalc() {
    const v = parseFloat(velocity), f = parseFloat(frequency), d = parseFloat(displacement);
    if (mode === 'velocity' && !isNaN(f) && !isNaN(d)) {
      setResult(`Velocity: ${calcVelocity(f, d).toFixed(4)} mm/s`);
    } else if (mode === 'frequency' && !isNaN(v) && !isNaN(d)) {
      setResult(`Frequency: ${calcFrequency(v, d).toFixed(4)} Hz`);
    } else if (mode === 'displacement' && !isNaN(v) && !isNaN(f)) {
      setResult(`Displacement: ${calcDisplacement(v, f).toFixed(4)} mm`);
    }
  }

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <Select label="Calculate" options={[{value:'velocity',label:'Velocity (from freq + disp)'},{value:'frequency',label:'Frequency (from vel + disp)'},{value:'displacement',label:'Displacement (from vel + freq)'}]} value={mode} onChange={e => setMode(e.target.value)} />
        {mode !== 'velocity' && <Input label="Velocity (mm/s)" type="number" value={velocity} onChange={e => setVelocity(e.target.value)} />}
        {mode !== 'frequency' && <Input label="Frequency (Hz)" type="number" value={frequency} onChange={e => setFrequency(e.target.value)} />}
        {mode !== 'displacement' && <Input label="Displacement (mm)" type="number" value={displacement} onChange={e => setDisplacement(e.target.value)} />}
        <Button onClick={handleCalc}>Calculate</Button>
        {result && (
          <div className="rounded-md border border-gray-200 bg-gray-50 p-4 text-center">
            <p className="text-xl font-bold text-gray-900">{result}</p>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
