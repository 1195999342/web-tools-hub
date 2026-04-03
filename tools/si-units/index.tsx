'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import type { ToolMeta } from '../registry';
import { SI_CATEGORIES, convertSI } from './logic';

export default function SiUnitsTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.si-units');
  const cats = Object.keys(SI_CATEGORIES);
  const [cat, setCat] = useState(cats[0]);
  const [value, setValue] = useState('1');
  const [from, setFrom] = useState(Object.keys(SI_CATEGORIES[cats[0]])[0]);
  const units = Object.keys(SI_CATEGORIES[cat] || {});
  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <Select label={t('category_label')} options={cats.map(c => ({ value: c, label: c.charAt(0).toUpperCase() + c.slice(1) }))} value={cat} onChange={e => { setCat(e.target.value); setFrom(Object.keys(SI_CATEGORIES[e.target.value])[0]); }} />
        <div className="flex gap-4"><Input label={t('value_label')} type="number" value={value} onChange={e => setValue(e.target.value)} /><Select label={t('from_label')} options={units.map(u => ({ value: u, label: u }))} value={from} onChange={e => setFrom(e.target.value)} /></div>
        <div className="space-y-2">{units.map(u => <div key={u} className="flex justify-between border-b py-1 text-sm"><span>{u}</span><span className="font-mono">{convertSI(parseFloat(value) || 0, from, u, cat).toPrecision(6)}</span></div>)}</div>
      </div>
    </ToolLayout>
  );
}
