'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import CodeEditor from '../../components/ui/CodeEditor';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import CopyButton from '../../components/ui/CopyButton';
import { jsonToPostmanCollection } from './logic';
import type { ToolMeta } from '../registry';

const sample = `{
  "method": "POST",
  "url": "https://api.example.com/users",
  "headers": {
    "Content-Type": "application/json",
    "Authorization": "Bearer token123"
  },
  "body": {"name": "Alice", "email": "alice@example.com"}
}`;

export default function JsonPostmanTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.json-postman');
  const [json, setJson] = useState(sample);
  const [name, setName] = useState('My Collection');
  const [output, setOutput] = useState('');

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <Input label="Collection Name" value={name} onChange={e => setName(e.target.value)} />
        <CodeEditor label="JSON Input" value={json} onChange={setJson} showLineNumbers rows={10} />
        <Button onClick={() => setOutput(jsonToPostmanCollection(json, name))}>Generate Postman Collection</Button>
        {output && (
          <div className="relative">
            <CodeEditor label="Postman Collection JSON" value={output} readOnly showLineNumbers rows={16} />
            <div className="mt-2 flex justify-end"><CopyButton text={output} /></div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
