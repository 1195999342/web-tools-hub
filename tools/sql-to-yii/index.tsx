'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import CodeEditor from '../../components/ui/CodeEditor';
import Button from '../../components/ui/Button';
import CopyButton from '../../components/ui/CopyButton';
import { sqlToYii } from './logic';
import type { ToolMeta } from '../registry';

const sample = `CREATE TABLE orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  product_name VARCHAR(200) NOT NULL,
  quantity INT NOT NULL,
  total_price DECIMAL(10,2),
  status VARCHAR(20) NOT NULL,
  created_at DATETIME NOT NULL
);`;

export default function SqlToYiiTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.sql-to-yii');
  const [sql, setSql] = useState(sample);
  const [output, setOutput] = useState('');

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <CodeEditor label="SQL CREATE TABLE" value={sql} onChange={setSql} showLineNumbers rows={8} />
        <Button onClick={() => setOutput(sqlToYii(sql))}>Generate Yii2 Model</Button>
        {output && (
          <div className="relative">
            <CodeEditor label="Yii2 ActiveRecord" value={output} readOnly showLineNumbers rows={20} />
            <div className="mt-2 flex justify-end"><CopyButton text={output} /></div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
