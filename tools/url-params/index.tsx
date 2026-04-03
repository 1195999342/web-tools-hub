'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Textarea from '../../components/ui/Textarea';
import Button from '../../components/ui/Button';
import CopyButton from '../../components/ui/CopyButton';
import type { ToolMeta } from '../registry';
import { parseUrlParams, buildQueryString } from './logic';

export default function UrlParamsTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.url-params');
  const [input, setInput] = useState('');
  const [rows, setRows] = useState<{ key: string; value: string }[]>([]);
  const handleParse = () => setRows(parseUrlParams(input));
  const qs = buildQueryString(rows);
  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <Textarea value={input} onChange={e => setInput(e.target.value)} placeholder={t('input_placeholder')} rows={3} />
        <Button onClick={handleParse}>{t('parse_button')}</Button>
        {rows.length > 0 && (
          <>
            <table className="w-full border-collapse text-sm"><thead><tr><th className="border p-2 bg-gray-100 text-left">Key</th><th className="border p-2 bg-gray-100 text-left">Value</th></tr></thead>
              <tbody>{rows.map((r, i) => <tr key={i}><td className="border p-2"><input className="w-full border-0 bg-transparent" value={r.key} onChange={e => { const n = [...rows]; n[i] = { ...n[i], key: e.target.value }; setRows(n); }} /></td><td className="border p-2"><input className="w-full border-0 bg-transparent" value={r.value} onChange={e => { const n = [...rows]; n[i] = { ...n[i], value: e.target.value }; setRows(n); }} /></td></tr>)}</tbody></table>
            {qs && <div className="flex items-center gap-2"><code className="flex-1 rounded border bg-gray-50 p-2 text-xs break-all">{qs}</code><CopyButton text={qs} /></div>}
          </>
        )}
      </div>
    </ToolLayout>
  );
}
