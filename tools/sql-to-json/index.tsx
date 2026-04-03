'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import CodeEditor from '../../components/ui/CodeEditor';
import Button from '../../components/ui/Button';
import CopyButton from '../../components/ui/CopyButton';
import { sqlInsertToJson } from './logic';
import type { ToolMeta } from '../registry';

const sample = `INSERT INTO users (id, name, email, age) VALUES
(1, 'Alice', 'alice@example.com', 30),
(2, 'Bob', 'bob@example.com', 25),
(3, 'Charlie', 'charlie@example.com', NULL);`;

export default function SqlToJsonTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.sql-to-json');
  const [sql, setSql] = useState(sample);
  const [output, setOutput] = useState('');

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <CodeEditor label="SQL INSERT" value={sql} onChange={setSql} showLineNumbers rows={8} />
        <Button onClick={() => setOutput(sqlInsertToJson(sql))}>Convert to JSON</Button>
        {output && (
          <div className="relative">
            <CodeEditor label="JSON Output" value={output} readOnly showLineNumbers rows={12} />
            <div className="mt-2 flex justify-end"><CopyButton text={output} /></div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
