'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import CopyButton from '../../components/ui/CopyButton';
import type { ToolMeta } from '../registry';
import { generateHtpasswd } from './logic';

export default function HtpasswdGenTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.htpasswd-gen');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [output, setOutput] = useState('');

  const handleGenerate = async () => { if (username && password) setOutput(await generateHtpasswd(username, password)); };

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <Input label={t('username_label')} value={username} onChange={e => setUsername(e.target.value)} />
        <Input label={t('password_label')} type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <Button onClick={handleGenerate}>{t('generate_button')}</Button>
        {output && <div className="relative"><pre className="rounded-md border bg-gray-50 p-4 text-sm break-all">{output}</pre><div className="mt-2 flex justify-end"><CopyButton text={output} /></div></div>}
      </div>
    </ToolLayout>
  );
}
