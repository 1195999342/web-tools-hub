'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Button from '../../components/ui/Button';
import CopyButton from '../../components/ui/CopyButton';
import type { ToolMeta } from '../registry';
import { generateHash, verifyHash } from './logic';

export default function BcryptTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.bcrypt-tool');
  const [password, setPassword] = useState('');
  const [rounds, setRounds] = useState(10);
  const [hash, setHash] = useState('');
  const [verifyPw, setVerifyPw] = useState('');
  const [verifyHash2, setVerifyHash2] = useState('');
  const [result, setResult] = useState<boolean | null>(null);

  const handleGenerate = async () => { const h = await generateHash(password, rounds); setHash(h); };
  const handleVerify = async () => { const r = await verifyHash(verifyPw, verifyHash2); setResult(r); };

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <h3 className="font-semibold">{t('generate_label')}</h3>
          <Input label={t('password_label')} value={password} onChange={e => setPassword(e.target.value)} />
          <Input label={t('rounds_label')} type="number" value={rounds} onChange={e => setRounds(Number(e.target.value))} min={4} max={16} />
          <Button onClick={handleGenerate}>{t('generate_button')}</Button>
          {hash && <div className="relative"><pre className="rounded-md border bg-gray-50 p-3 text-sm break-all">{hash}</pre><div className="mt-2 flex justify-end"><CopyButton text={hash} /></div></div>}
        </div>
        <hr />
        <div className="flex flex-col gap-3">
          <h3 className="font-semibold">{t('verify_label')}</h3>
          <Input label={t('password_label')} value={verifyPw} onChange={e => setVerifyPw(e.target.value)} />
          <Textarea label={t('hash_label')} value={verifyHash2} onChange={e => setVerifyHash2(e.target.value)} rows={2} />
          <Button onClick={handleVerify} variant="secondary">{t('verify_button')}</Button>
          {result !== null && <p className={result ? 'text-green-600' : 'text-red-600'}>{result ? '✓ Match' : '✗ No match'}</p>}
        </div>
      </div>
    </ToolLayout>
  );
}
