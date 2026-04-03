'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import CodeEditor from '../../components/ui/CodeEditor';
import Button from '../../components/ui/Button';
import CopyButton from '../../components/ui/CopyButton';
import { sqlToJava } from './logic';
import type { ToolMeta } from '../registry';

const SAMPLE = `CREATE TABLE orders (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  product_name VARCHAR(200) NOT NULL,
  quantity INT DEFAULT 1,
  price DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  created_at DATETIME NOT NULL,
  updated_at TIMESTAMP
);`;

export default function MysqlToJavaTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.mysql-to-java');
  const [sql, setSql] = useState(SAMPLE);
  const [output, setOutput] = useState('');

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <CodeEditor label="MySQL CREATE TABLE" value={sql} onChange={setSql} showLineNumbers rows={8} />
        <Button onClick={() => setOutput(sqlToJava(sql))}>Convert to Java Entity</Button>
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
