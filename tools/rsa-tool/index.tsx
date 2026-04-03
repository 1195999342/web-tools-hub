'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Textarea from '../../components/ui/Textarea';
import Button from '../../components/ui/Button';
import CopyButton from '../../components/ui/CopyButton';
import type { ToolMeta } from '../registry';
import { generateKeyPair, rsaEncrypt, rsaDecrypt } from './logic';

export default function RsaTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.rsa-tool');
  const [pubKey, setPubKey] = useState('');
  const [privKey, setPrivKey] = useState('');
  const [plaintext, setPlaintext] = useState('');
  const [ciphertext, setCiphertext] = useState('');
  const [error, setError] = useState('');

  const handleGenerate = async () => { const kp = await generateKeyPair(); setPubKey(kp.publicKey); setPrivKey(kp.privateKey); };
  const handleEncrypt = async () => { try { setError(''); setCiphertext(await rsaEncrypt(plaintext, pubKey)); } catch (e) { setError((e as Error).message); } };
  const handleDecrypt = async () => { try { setError(''); setPlaintext(await rsaDecrypt(ciphertext, privKey)); } catch (e) { setError((e as Error).message); } };

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <Button onClick={handleGenerate}>{t('generate_button')}</Button>
        <Textarea label={t('public_key')} value={pubKey} onChange={e => setPubKey(e.target.value)} rows={4} className="font-mono text-xs" />
        <Textarea label={t('private_key')} value={privKey} onChange={e => setPrivKey(e.target.value)} rows={4} className="font-mono text-xs" />
        <hr />
        <Textarea label={t('plaintext_label')} value={plaintext} onChange={e => setPlaintext(e.target.value)} rows={3} />
        <div className="flex gap-2">
          <Button onClick={handleEncrypt}>{t('encrypt_button')}</Button>
          <Button onClick={handleDecrypt} variant="secondary">{t('decrypt_button')}</Button>
        </div>
        <Textarea label={t('ciphertext_label')} value={ciphertext} onChange={e => setCiphertext(e.target.value)} rows={3} className="font-mono text-xs" />
        {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
        {ciphertext && <div className="flex justify-end"><CopyButton text={ciphertext} /></div>}
      </div>
    </ToolLayout>
  );
}
