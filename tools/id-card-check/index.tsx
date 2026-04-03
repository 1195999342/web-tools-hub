'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { parseIDCard } from './logic';
import type { IDCardInfo } from './logic';
import type { ToolMeta } from '../registry';

export default function IdCardCheckTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.id-card-check');
  const [id, setId] = useState('');
  const [result, setResult] = useState<IDCardInfo | null>(null);

  function handleCheck() {
    if (!id.trim()) return;
    setResult(parseIDCard(id));
  }

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <div className="flex gap-3 items-end">
          <Input label="ID Card Number (18 digits)" value={id} onChange={e => setId(e.target.value)} placeholder="Enter 18-digit ID number" />
          <Button onClick={handleCheck}>Check</Button>
        </div>
        {result && (
          <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className={`inline-block w-3 h-3 rounded-full ${result.valid ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="font-medium text-gray-900">{result.valid ? 'Valid' : 'Invalid'} checksum</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <p className="text-xs text-gray-500">Birthday</p>
                <p className="text-sm font-medium text-gray-900">{result.birthday || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Gender</p>
                <p className="text-sm font-medium text-gray-900">{result.gender || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Region code</p>
                <p className="text-sm font-medium text-gray-900">{result.region || '—'}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
