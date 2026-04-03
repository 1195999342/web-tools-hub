'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import { calcBandwidth, calcData, calcTime, formatTime } from './logic';
import type { ToolMeta } from '../registry';

export default function BandwidthCalcTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.bandwidth-calc');
  const [mode, setMode] = useState('time');
  const [bandwidth, setBandwidth] = useState('100');
  const [data, setData] = useState('500');
  const [time, setTime] = useState('');
  const [result, setResult] = useState('');

  function handleCalc() {
    const bw = parseFloat(bandwidth), d = parseFloat(data), tm = parseFloat(time);
    if (mode === 'time' && !isNaN(bw) && !isNaN(d)) {
      const s = calcTime(bw, d);
      setResult(`Time: ${formatTime(s)}`);
    } else if (mode === 'data' && !isNaN(bw) && !isNaN(tm)) {
      setResult(`Data: ${calcData(bw, tm).toFixed(2)} MB`);
    } else if (mode === 'bandwidth' && !isNaN(d) && !isNaN(tm)) {
      setResult(`Bandwidth: ${calcBandwidth(d, tm).toFixed(2)} Mbps`);
    }
  }

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <Select label="Calculate" options={[{value:'time',label:'Time (from bandwidth + data)'},{value:'data',label:'Data (from bandwidth + time)'},{value:'bandwidth',label:'Bandwidth (from data + time)'}]} value={mode} onChange={e => setMode(e.target.value)} />
        {mode !== 'bandwidth' && <Input label="Bandwidth (Mbps)" type="number" value={bandwidth} onChange={e => setBandwidth(e.target.value)} />}
        {mode !== 'data' && <Input label="Data size (MB)" type="number" value={data} onChange={e => setData(e.target.value)} />}
        {mode !== 'time' && <Input label="Time (seconds)" type="number" value={time} onChange={e => setTime(e.target.value)} />}
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
