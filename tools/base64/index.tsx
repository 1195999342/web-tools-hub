'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Textarea from '../../components/ui/Textarea';
import Button from '../../components/ui/Button';
import CopyButton from '../../components/ui/CopyButton';
import Tabs from '../../components/ui/Tabs';
import Toggle from '../../components/ui/Toggle';
import { encode, decode, encodeUrlSafe, decodeUrlSafe } from './logic';
import type { ToolMeta } from '../../tools/registry';

interface Base64Props {
  locale: string;
  toolMeta: ToolMeta;
}

export default function Base64Tool({ locale, toolMeta }: Base64Props) {
  const t = useTranslations('tools.base64');
  const [activeTab, setActiveTab] = useState('encode');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [urlSafe, setUrlSafe] = useState(false);

  const tabs = [
    { id: 'encode', label: t('encode_tab') },
    { id: 'decode', label: t('decode_tab') },
  ];

  function handleAction() {
    setError('');
    setOutput('');
    if (activeTab === 'encode') {
      const result = urlSafe ? encodeUrlSafe(input) : encode(input);
      if (result.error) setError(result.error);
      else setOutput(result.output ?? '');
    } else {
      const result = urlSafe ? decodeUrlSafe(input) : decode(input);
      if (result.error) setError(t('error_invalid_base64'));
      else setOutput(result.output ?? '');
    }
  }

  function handleTabChange(tabId: string) {
    setActiveTab(tabId);
    setInput('');
    setOutput('');
    setError('');
  }

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <Tabs tabs={tabs} activeTab={activeTab} onTabChange={handleTabChange} />

        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('input_placeholder')}
          rows={8}
        />

        <div className="flex items-center gap-4">
          <Button onClick={handleAction}>
            {activeTab === 'encode' ? t('encode_button') : t('decode_button')}
          </Button>
          <Toggle
            label={t('url_safe_label')}
            checked={urlSafe}
            onChange={setUrlSafe}
          />
        </div>

        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        {output && (
          <div className="relative">
            <pre className="rounded-md border border-gray-200 bg-gray-50 p-4 overflow-auto text-sm text-gray-900 whitespace-pre-wrap break-all">
              <code>{output}</code>
            </pre>
            <div className="mt-2 flex justify-end">
              <CopyButton text={output} />
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
