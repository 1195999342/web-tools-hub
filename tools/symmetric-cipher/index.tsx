'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Textarea from '../../components/ui/Textarea';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import CopyButton from '../../components/ui/CopyButton';
import Tabs from '../../components/ui/Tabs';
import { aesEncrypt, aesDecrypt } from './logic';
import type { ToolMeta } from '../../tools/registry';

export default function SymmetricCipherTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.symmetric-cipher');
  const [activeTab, setActiveTab] = useState('encrypt');
  const [input, setInput] = useState('');
  const [password, setPassword] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const tabs = [
    { id: 'encrypt', label: t('encrypt_tab') },
    { id: 'decrypt', label: t('decrypt_tab') },
  ];

  async function handleAction() {
    setError(''); setOutput('');
    const result = activeTab === 'encrypt'
      ? await aesEncrypt(input, password)
      : await aesDecrypt(input, password);
    if (result.error) setError(result.error);
    else setOutput(result.output ?? '');
  }

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <Tabs tabs={tabs} activeTab={activeTab} onTabChange={(id) => { setActiveTab(id); setInput(''); setOutput(''); setError(''); }} />
        <Textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder={t('input_placeholder')} rows={6} />
        <Input label={t('password_label')} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={t('password_placeholder')} />
        <Button onClick={handleAction}>{activeTab === 'encrypt' ? t('encrypt_button') : t('decrypt_button')}</Button>
        {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
        {output && (
          <div className="relative">
            <pre className="rounded-md border border-gray-200 bg-gray-50 p-4 overflow-auto text-sm text-gray-900 whitespace-pre-wrap break-all"><code>{output}</code></pre>
            <div className="mt-2 flex justify-end"><CopyButton text={output} /></div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
