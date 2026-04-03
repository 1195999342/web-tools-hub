'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import CopyButton from '../../components/ui/CopyButton';
import type { ToolMeta } from '../registry';
import { parseCrxInput } from './logic';

export default function CrxParserTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.crx-parser');
  const [input, setInput] = useState('');
  const result = parseCrxInput(input);
  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <Input
          label="Extension ID or Chrome Web Store URL"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="e.g. cjpalhdlnbpafiamejdnhcphjbkeiagm or full URL"
        />
        {result && (
          <div className="flex flex-col gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div>
              <span className="text-sm font-medium text-gray-600">Extension ID:</span>
              <div className="flex items-center gap-2 mt-1">
                <code className="text-sm font-mono bg-white px-2 py-1 rounded border">{result.extensionId}</code>
                <CopyButton text={result.extensionId} />
              </div>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600">Web Store URL:</span>
              <div className="flex items-center gap-2 mt-1">
                <code className="text-xs font-mono bg-white px-2 py-1 rounded border break-all">{result.chromeWebStoreUrl}</code>
                <CopyButton text={result.chromeWebStoreUrl} />
              </div>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600">CRX Download URL:</span>
              <div className="flex items-center gap-2 mt-1">
                <code className="text-xs font-mono bg-white px-2 py-1 rounded border break-all">{result.crxDownloadUrl}</code>
                <CopyButton text={result.crxDownloadUrl} />
              </div>
            </div>
            <a href={result.crxDownloadUrl} target="_blank" rel="noopener noreferrer" className="inline-block">
              <Button>Download CRX</Button>
            </a>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
