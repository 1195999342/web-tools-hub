'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import CopyButton from '../../components/ui/CopyButton';
import type { ToolMeta } from '../registry';
import { wgs84ToGcj02, gcj02ToBd09, bd09ToGcj02 } from './logic';

export default function GeoCoordsTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.geo-coords');
  const [lng, setLng] = useState('116.397428');
  const [lat, setLat] = useState('39.90923');
  const [mode, setMode] = useState('wgs2gcj');
  const [result, setResult] = useState('');
  const handleConvert = () => {
    const lo = parseFloat(lng), la = parseFloat(lat);
    let r: [number, number];
    if (mode === 'wgs2gcj') r = wgs84ToGcj02(lo, la);
    else if (mode === 'gcj2bd') r = gcj02ToBd09(lo, la);
    else r = bd09ToGcj02(lo, la);
    setResult(`${r[0].toFixed(6)}, ${r[1].toFixed(6)}`);
  };
  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <div className="flex gap-4"><Input label={t('lng_label')} value={lng} onChange={e => setLng(e.target.value)} /><Input label={t('lat_label')} value={lat} onChange={e => setLat(e.target.value)} /></div>
        <Select label={t('mode_label')} options={[{ value: 'wgs2gcj', label: 'WGS-84 → GCJ-02' }, { value: 'gcj2bd', label: 'GCJ-02 → BD-09' }, { value: 'bd2gcj', label: 'BD-09 → GCJ-02' }]} value={mode} onChange={e => setMode(e.target.value)} />
        <Button onClick={handleConvert}>{t('convert_button')}</Button>
        {result && <div className="flex items-center gap-2"><code className="flex-1 rounded border bg-gray-50 p-3 text-sm">{result}</code><CopyButton text={result} /></div>}
      </div>
    </ToolLayout>
  );
}
