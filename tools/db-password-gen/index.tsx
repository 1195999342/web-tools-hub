'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import CopyButton from '../../components/ui/CopyButton';
import type { ToolMeta } from '../registry';
import { generateDbHash, type DbType } from './logic';

export default function DbPasswordGenTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.db-password-gen');
  const [dbType, setDbType] = useState<DbType>('mysql');
  const [password, setPassword] = useState('');
  const [hash, setHash] = useState('');

  const dbOptions = [
    { value: 'mysql', label: 'MySQL' },
    { value: 'mariadb', label: 'MariaDB' },
    { value: 'postgresql', label: 'PostgreSQL' },
  ];

  async function handleGenerate() {
    if (!password) return;
    const result = await generateDbHash(dbType, password);
    setHash(result);
  }

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <Select label="Database Type" options={dbOptions} value={dbType} onChange={e => setDbType(e.target.value as DbType)} />
        <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password to hash" />
        <Button onClick={handleGenerate}>Generate Hash</Button>
        {hash && (
          <div className="relative">
            <pre className="rounded-md border border-gray-200 bg-gray-50 p-4 overflow-auto text-sm font-mono text-gray-900 break-all">{hash}</pre>
            <div className="mt-2 flex justify-end"><CopyButton text={hash} /></div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
