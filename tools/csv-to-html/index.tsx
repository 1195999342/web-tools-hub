'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Textarea from '../../components/ui/Textarea';
import Select from '../../components/ui/Select';
import Toggle from '../../components/ui/Toggle';
import Button from '../../components/ui/Button';
import CopyButton from '../../components/ui/CopyButton';
import { csvToRows, rowsToHtml } from './logic';
import type { ToolMeta } from '../registry';

export default function CsvToHtmlTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.csv-to-html');
  const [csv, setCsv] = useState('Name, Age, City\nAlice, 30, NYC\nBob, 25, LA');
  const [delimiter, setDelimiter] = useState(',');
  const [hasHeader, setHasHeader] = useState(true);
  const [html, setHtml] = useState('');
  const [rows, setRows] = useState<string[][]>([]);

  function handleConvert() {
    const r = csvToRows(csv, delimiter);
    setRows(r);
    setHtml(rowsToHtml(r, hasHeader));
  }

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <Textarea label="CSV Input" value={csv} onChange={e => setCsv(e.target.value)} rows={6} />
        <div className="flex items-center gap-4">
          <Select label="Delimiter" options={[{value:',',label:'Comma (,)'},{value:'\t',label:'Tab'},{value:';',label:'Semicolon (;)'},{value:'|',label:'Pipe (|)'}]} value={delimiter} onChange={e => setDelimiter(e.target.value)} />
          <Toggle label="First row is header" checked={hasHeader} onChange={setHasHeader} />
        </div>
        <Button onClick={handleConvert}>Convert</Button>
        {rows.length > 0 && (
          <>
            <div className="overflow-auto rounded-md border border-gray-200">
              <table className="min-w-full text-sm">
                {hasHeader && rows.length > 0 && (
                  <thead className="bg-gray-100">
                    <tr>{rows[0].map((c, i) => <th key={i} className="px-3 py-2 text-left font-medium text-gray-700">{c}</th>)}</tr>
                  </thead>
                )}
                <tbody className="divide-y divide-gray-100">
                  {rows.slice(hasHeader ? 1 : 0).map((row, ri) => (
                    <tr key={ri}>{row.map((c, ci) => <td key={ci} className="px-3 py-2 text-gray-900">{c}</td>)}</tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="relative">
              <pre className="rounded-md border border-gray-200 bg-gray-50 p-4 overflow-auto text-xs text-gray-900 whitespace-pre-wrap max-h-48">{html}</pre>
              <div className="mt-2 flex justify-end"><CopyButton text={html} /></div>
            </div>
          </>
        )}
      </div>
    </ToolLayout>
  );
}
