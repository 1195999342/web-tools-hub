'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import CopyButton from '../../components/ui/CopyButton';
import CodeEditor from '../../components/ui/CodeEditor';
import { parseURL, toPostmanRequest } from './logic';
import type { ToolMeta } from '../registry';

export default function UrlPostmanTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.url-postman');
  const [url, setUrl] = useState('https://api.example.com/users?page=1&limit=10');
  const [method, setMethod] = useState('GET');
  const [output, setOutput] = useState('');

  function handleConvert() {
    const parsed = parseURL(url);
    parsed.method = method;
    setOutput(toPostmanRequest(parsed));
  }

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <Input label="URL" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://api.example.com/path?key=value" />
        <Select label="Method" options={['GET', 'POST', 'PUT', 'DELETE', 'PATCH'].map(m => ({ value: m, label: m }))} value={method} onChange={e => setMethod(e.target.value)} />
        <Button onClick={handleConvert}>Generate Postman Request</Button>
        {output && (
          <div className="relative">
            <CodeEditor label="Postman Collection" value={output} readOnly showLineNumbers rows={16} />
            <div className="mt-2 flex justify-end"><CopyButton text={output} /></div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
