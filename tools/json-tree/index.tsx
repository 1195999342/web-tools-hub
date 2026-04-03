'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Textarea from '../../components/ui/Textarea';
import Button from '../../components/ui/Button';
import type { ToolMeta } from '../registry';
import { parseJSON, isObject, isArray, getType } from './logic';

function TreeNode({ label, value, depth }: { label: string; value: unknown; depth: number }) {
  const [open, setOpen] = useState(depth < 2);
  const expandable = isObject(value) || isArray(value);
  const type = getType(value);

  if (!expandable) {
    return (
      <div className="flex gap-1 py-0.5" style={{ paddingLeft: depth * 16 }}>
        <span className="text-purple-600">{label}:</span>
        <span className={type === 'string' ? 'text-green-700' : type === 'number' ? 'text-blue-600' : 'text-orange-600'}>
          {type === 'string' ? `"${String(value)}"` : String(value)}
        </span>
      </div>
    );
  }

  const entries = isArray(value)
    ? value.map((v, i) => [String(i), v] as [string, unknown])
    : Object.entries(value as Record<string, unknown>);

  return (
    <div style={{ paddingLeft: depth * 16 }}>
      <button onClick={() => setOpen(!open)} className="flex items-center gap-1 py-0.5 hover:bg-gray-100 rounded text-sm">
        <span className="w-4 text-gray-400">{open ? '▼' : '▶'}</span>
        <span className="text-purple-600">{label}</span>
        <span className="text-gray-400">{isArray(value) ? `[${entries.length}]` : `{${entries.length}}`}</span>
      </button>
      {open && entries.map(([k, v]) => <TreeNode key={k} label={k} value={v} depth={depth + 1} />)}
    </div>
  );
}

export default function JsonTreeTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.json-tree');
  const [input, setInput] = useState('');
  const [data, setData] = useState<unknown>(null);
  const [error, setError] = useState('');

  const handleParse = useCallback(() => {
    const r = parseJSON(input);
    if (r.error) { setError(r.error); setData(null); }
    else { setData(r.data); setError(''); }
  }, [input]);

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <Textarea value={input} onChange={e => setInput(e.target.value)} placeholder={t('input_placeholder')} rows={6} />
        <Button onClick={handleParse}>{t('parse_button')}</Button>
        {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
        {data !== null && (
          <div className="rounded-md border border-gray-200 bg-gray-50 p-4 text-sm font-mono overflow-auto max-h-[500px]">
            <TreeNode label="root" value={data} depth={0} />
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
