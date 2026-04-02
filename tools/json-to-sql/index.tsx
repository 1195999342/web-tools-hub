'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Textarea from '../../components/ui/Textarea';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import CopyButton from '../../components/ui/CopyButton';
import { jsonToSql } from './logic';
import type { ToolMeta } from '../../tools/registry';

export default function JsonToSqlTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.json-to-sql');
  const [input, setInput] = useState('');
  const [tableName, setTableName] = useState('my_table');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  function handleConvert() {
    setError('');
    const result = jsonToSql(input, tableName);
    if (result.error) setError(result.error);
    else setOutput(result.output ?? '');
  }

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <Textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder={t('input_placeholder')} rows={8} />
        <Input label={t('table_name_label')} value={tableName} onChange={(e) => setTableName(e.target.value)} />
        <Button onClick={handleConvert}>{t('convert_button')}</Button>
        {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
        {output && (
          <div className="relative">
            <pre className="rounded-md border border-gray-200 bg-gray-50 p-4 overflow-auto text-sm text-gray-900 whitespace-pre-wrap"><code>{output}</code></pre>
            <div className="mt-2 flex justify-end"><CopyButton text={output} /></div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
