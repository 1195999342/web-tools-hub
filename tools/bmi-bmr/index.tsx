'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import { calcBMI, bmiCategory, calcBMR } from './logic';
import type { ToolMeta } from '../registry';

export default function BmiBmrTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.bmi-bmr');
  const [height, setHeight] = useState('170');
  const [weight, setWeight] = useState('70');
  const [age, setAge] = useState('30');
  const [gender, setGender] = useState('male');
  const [bmi, setBmi] = useState<number | null>(null);
  const [bmr, setBmr] = useState<number | null>(null);

  function handleCalc() {
    const h = parseFloat(height), w = parseFloat(weight), a = parseInt(age);
    if (isNaN(h) || isNaN(w) || isNaN(a) || h <= 0 || w <= 0 || a <= 0) return;
    setBmi(calcBMI(w, h));
    setBmr(calcBMR(w, h, a, gender as 'male' | 'female'));
  }

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <Input label="Height (cm)" type="number" value={height} onChange={e => setHeight(e.target.value)} />
          <Input label="Weight (kg)" type="number" value={weight} onChange={e => setWeight(e.target.value)} />
          <Input label="Age" type="number" value={age} onChange={e => setAge(e.target.value)} />
          <Select label="Gender" options={[{value:'male',label:'Male'},{value:'female',label:'Female'}]} value={gender} onChange={e => setGender(e.target.value)} />
        </div>
        <Button onClick={handleCalc}>Calculate</Button>
        {bmi !== null && bmr !== null && (
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-md border border-gray-200 bg-gray-50 p-4 text-center">
              <p className="text-xs text-gray-500">BMI</p>
              <p className="text-3xl font-bold text-gray-900">{bmi.toFixed(1)}</p>
              <p className="text-sm text-gray-600 mt-1">{bmiCategory(bmi)}</p>
            </div>
            <div className="rounded-md border border-gray-200 bg-gray-50 p-4 text-center">
              <p className="text-xs text-gray-500">BMR</p>
              <p className="text-3xl font-bold text-gray-900">{bmr.toFixed(0)}</p>
              <p className="text-sm text-gray-600 mt-1">kcal/day</p>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
