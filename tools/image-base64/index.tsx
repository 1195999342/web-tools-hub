'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import FileDropzone from '../../components/ui/FileDropzone';
import CopyButton from '../../components/ui/CopyButton';
import type { ToolMeta } from '../registry';
import { imageToBase64 } from './logic';

export default function ImageBase64Tool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.image-base64');
  const [base64, setBase64] = useState('');
  const [dataUri, setDataUri] = useState('');
  const [preview, setPreview] = useState('');

  const handleFile = async (files: File[]) => {
    if (!files[0]) return;
    const result = await imageToBase64(files[0]);
    setBase64(result.base64);
    setDataUri(result.dataUri);
    setPreview(result.dataUri);
  };

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <FileDropzone onFiles={handleFile} accept="image/*" label={t('drop_label')} />
        {preview && <img src={preview} alt="Preview" className="max-h-48 object-contain" />}
        {dataUri && (
          <div className="relative">
            <p className="text-sm font-medium text-gray-700 mb-1">Data URI</p>
            <pre className="rounded-md border border-gray-200 bg-gray-50 p-4 text-xs text-gray-900 whitespace-pre-wrap break-all max-h-32 overflow-auto">{dataUri.slice(0, 500)}...</pre>
            <div className="mt-2 flex justify-end"><CopyButton text={dataUri} /></div>
          </div>
        )}
        {base64 && (
          <div className="relative">
            <p className="text-sm font-medium text-gray-700 mb-1">Base64</p>
            <pre className="rounded-md border border-gray-200 bg-gray-50 p-4 text-xs text-gray-900 whitespace-pre-wrap break-all max-h-32 overflow-auto">{base64.slice(0, 500)}...</pre>
            <div className="mt-2 flex justify-end"><CopyButton text={base64} /></div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
