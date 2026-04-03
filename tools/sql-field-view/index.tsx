'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import CodeEditor from '../../components/ui/CodeEditor';
import Button from '../../components/ui/Button';
import { extractFields } from './logic';
import type { ToolMeta } from '../registry';

const sample = `INSERT INTO users (id, name, email, age) VALUES (1, 'Alice', 'alice@example.com', 30);`;

export default function SqlFieldViewTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.sql-field-view');
  const [sql, setSql] = useState(sample);
  const [fields, setFields] = useState<{ name: string; value: string }[]>([]);

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <CodeEditor label="SQL (INSERT or UPDATE)" value={sql} onChange={setSql} showLineNumbers rows={6} />
        <Button onClick={() => setFields(extractFields(sql))}>Extract Fields</Button>
        {fields.length > 0 && (
          <div className="overflow-x-auto border rounded-md">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-2 text-left font-medium text-gray-700">#</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-700">Field</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-700">Value</th>
                </tr>
              </thead>
              <tbody>
                {fields.map((f, i) => (
                  <tr key={i} className="border-b last:border-0">
                    <td className="px-4 py-2 text-gray-500">{i + 1}</td>
                    <td className="px-4 py-2 font-mono">{f.name}</td>
                    <td className="px-4 py-2 font-mono">{f.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
