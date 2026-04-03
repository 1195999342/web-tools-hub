'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Textarea from '../../components/ui/Textarea';
import Button from '../../components/ui/Button';
import type { ToolMeta } from '../registry';
import { parseCookies } from './logic';

export default function CookieFormatterTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.cookie-formatter');
  const [input, setInput] = useState('');
  const [rows, setRows] = useState<{ key: string; value: string }[]>([]);
  const handleParse = () => setRows(parseCookies(input));
  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <Textarea value={input} onChange={e => setInput(e.target.value)} placeholder={t('input_placeholder')} rows={4} />
        <Button onClick={handleParse}>{t('parse_button')}</Button>
        {rows.length > 0 && (
          <table className="w-full border-collapse text-sm"><thead><tr><th className="border p-2 bg-gray-100 text-left">Key</th><th className="border p-2 bg-gray-100 text-left">Value</th></tr></thead>
            <tbody>{rows.map((r, i) => <tr key={i}><td className="border p-2 font-mono">{r.key}</td><td className="border p-2 font-mono break-all">{r.value}</td></tr>)}</tbody></table>
        )}
      </div>
    </ToolLayout>
  );
}
