'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import FileDropzone from '../../components/ui/FileDropzone';
import type { ToolMeta } from '../registry';
import { detectFileType, type FileTypeResult } from './logic';

export default function FileTypeDetectTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.file-type-detect');
  const [result, setResult] = useState<FileTypeResult | null>(null);
  const [fileName, setFileName] = useState('');

  function handleFiles(files: File[]) {
    const file = files[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      const bytes = new Uint8Array(reader.result as ArrayBuffer);
      setResult(detectFileType(bytes));
    };
    reader.readAsArrayBuffer(file.slice(0, 256));
  }

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <FileDropzone onFiles={handleFiles} label="Drop any file here to detect its type" />
        {result && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex flex-col gap-3">
            <div className="text-sm"><span className="font-medium text-gray-600">File:</span> <span className="text-gray-900">{fileName}</span></div>
            <div className="text-sm"><span className="font-medium text-gray-600">Type:</span> <span className="text-gray-900 font-semibold">{result.description}</span></div>
            <div className="text-sm"><span className="font-medium text-gray-600">MIME:</span> <code className="bg-white px-2 py-0.5 rounded border text-xs">{result.mimeType}</code></div>
            {result.extension && <div className="text-sm"><span className="font-medium text-gray-600">Extension:</span> <code className="bg-white px-2 py-0.5 rounded border text-xs">{result.extension}</code></div>}
            <div className="text-sm"><span className="font-medium text-gray-600">Magic bytes:</span> <code className="bg-gray-900 text-green-400 px-2 py-1 rounded text-xs font-mono">{result.hex}</code></div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
