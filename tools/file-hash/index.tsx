'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import FileDropzone from '../../components/ui/FileDropzone';
import CopyButton from '../../components/ui/CopyButton';
import type { ToolMeta } from '../registry';
import { computeFileHash, ALGORITHMS } from './logic';

export default function FileHashTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.file-hash');
  const [results, setResults] = useState<Record<string, string>>({});
  const [fileName, setFileName] = useState('');

  const handleFile = async (files: File[]) => {
    if (!files[0]) return;
    setFileName(files[0].name);
    const r: Record<string, string> = {};
    for (const algo of ALGORITHMS) r[algo] = await computeFileHash(files[0], algo);
    setResults(r);
  };

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <FileDropzone onFiles={handleFile} label={t('drop_label')} />
        {fileName && <p className="text-sm text-gray-600">{fileName}</p>}
        {Object.keys(results).length > 0 && (
          <div className="space-y-3">
            {ALGORITHMS.map(algo => (
              <div key={algo} className="flex flex-col gap-1">
                <span className="text-sm font-medium">{algo}</span>
                <div className="flex items-center gap-2">
                  <code className="flex-1 rounded border bg-gray-50 p-2 text-xs break-all">{results[algo]}</code>
                  <CopyButton text={results[algo]} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
