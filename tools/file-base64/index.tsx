'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Textarea from '../../components/ui/Textarea';
import Button from '../../components/ui/Button';
import CopyButton from '../../components/ui/CopyButton';
import FileDropzone from '../../components/ui/FileDropzone';
import Tabs from '../../components/ui/Tabs';
import { fileToBase64, base64ToBlob } from './logic';
import type { ToolMeta } from '../../tools/registry';

export default function FileBase64Tool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.file-base64');
  const [activeTab, setActiveTab] = useState('encode');
  const [base64Output, setBase64Output] = useState('');
  const [dataUri, setDataUri] = useState('');
  const [decodeInput, setDecodeInput] = useState('');
  const [error, setError] = useState('');

  const tabs = [
    { id: 'encode', label: t('encode_tab') },
    { id: 'decode', label: t('decode_tab') },
  ];

  async function handleFiles(files: File[]) {
    if (files.length === 0) return;
    setError('');
    const result = await fileToBase64(files[0]);
    if (result.error) setError(result.error);
    else { setBase64Output(result.output!.base64); setDataUri(result.output!.dataUri); }
  }

  function handleDecode() {
    setError('');
    const result = base64ToBlob(decodeInput);
    if (result.error) { setError(result.error); return; }
    const url = URL.createObjectURL(result.output!);
    const a = document.createElement('a');
    a.href = url; a.download = 'decoded-file'; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <Tabs tabs={tabs} activeTab={activeTab} onTabChange={(id) => { setActiveTab(id); setBase64Output(''); setDataUri(''); setDecodeInput(''); setError(''); }} />
        {activeTab === 'encode' ? (
          <>
            <FileDropzone onFiles={handleFiles} label={t('drop_label')} />
            {base64Output && (
              <div className="flex flex-col gap-2">
                <Textarea label="Base64" value={base64Output} readOnly rows={6} />
                <CopyButton text={base64Output} />
                <Textarea label="Data URI" value={dataUri} readOnly rows={3} />
                <CopyButton text={dataUri} />
              </div>
            )}
          </>
        ) : (
          <>
            <Textarea value={decodeInput} onChange={(e) => setDecodeInput(e.target.value)} placeholder={t('decode_placeholder')} rows={6} />
            <Button onClick={handleDecode}>{t('decode_button')}</Button>
          </>
        )}
        {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
      </div>
    </ToolLayout>
  );
}
