'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import CodeEditor from '../../components/ui/CodeEditor';
import Button from '../../components/ui/Button';
import CopyButton from '../../components/ui/CopyButton';
import { sqlToJava } from './logic';
import type { ToolMeta } from '../registry';

const sample = `CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL,
  age INT,
  created_at DATETIME NOT NULL
);`;

export default function SqlToJavaTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.sql-to-java');
  const [sql, setSql] = useState(sample);
  const [output, setOutput] = useState('');

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <CodeEditor label="SQL CREATE TABLE" value={sql} onChange={setSql} showLineNumbers rows={8} />
        <Button onClick={() => setOutput(sqlToJava(sql))}>Convert to Java</Button>
        {output && (
          <div className="relative">
            <CodeEditor label="Java Class" value={output} readOnly showLineNumbers rows={16} />
            <div className="mt-2 flex justify-end"><CopyButton text={output} /></div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
