'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import CopyButton from '../../components/ui/CopyButton';
import { getPiDigits, searchInPi } from './logic';
import type { ToolMeta } from '../registry';

export default function PiLookupTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.pi-lookup');
  const [digits, setDigits] = useState('50');
  const [piStr, setPiStr] = useState('');
  const [searchSeq, setSearchSeq] = useState('');
  const [searchResult, setSearchResult] = useState<number | null>(null);

  function handleShow() {
    const n = parseInt(digits);
    if (isNaN(n) || n < 1 || n > 200) return;
    setPiStr(getPiDigits(n));
  }

  function handleSearch() {
    if (!searchSeq.trim()) return;
    setSearchResult(searchInPi(searchSeq.trim()));
  }

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <div className="flex gap-3 items-end">
          <Input label="Digits of Pi (max 200)" type="number" min={1} max={200} value={digits} onChange={e => setDigits(e.target.value)} />
          <Button onClick={handleShow}>Show</Button>
        </div>
        {piStr && (
          <div className="relative">
            <pre className="rounded-md border border-gray-200 bg-gray-50 p-4 overflow-auto text-sm text-gray-900 whitespace-pre-wrap break-all font-mono">
              {piStr}
            </pre>
            <div className="mt-2 flex justify-end"><CopyButton text={piStr} /></div>
          </div>
        )}
        <div className="border-t border-gray-200 pt-4">
          <div className="flex gap-3 items-end">
            <Input label="Search sequence in Pi" value={searchSeq} onChange={e => setSearchSeq(e.target.value)} placeholder="141" />
            <Button onClick={handleSearch} variant="secondary">Search</Button>
          </div>
          {searchResult !== null && (
            <p className="text-sm mt-2 text-gray-700">
              {searchResult >= 0 ? `Found at position ${searchResult} after decimal point` : 'Sequence not found in available digits'}
            </p>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
