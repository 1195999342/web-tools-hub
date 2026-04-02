'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Input from '../../components/ui/Input';
import CopyButton from '../../components/ui/CopyButton';
import type { ToolMeta } from '../registry';
import { parseURL } from './logic';

export default function URLParserTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.url-parser');
  const [url, setUrl] = useState('https://example.com:8080/path/page?key=value&foo=bar#section');
  const parsed = parseURL(url);

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <Input label={t('url_label')} value={url} onChange={e => setUrl(e.target.value)} placeholder="https://example.com/path?key=value" />
        {parsed ? (
          <div className="grid grid-cols-1 gap-2">
            {Object.entries(parsed).filter(([k]) => k !== 'params').map(([k, v]) => (
              <div key={k} className="flex items-center gap-2 rounded border border-gray-200 bg-gray-50 p-2">
                <span className="text-sm font-medium text-gray-600 w-24">{k}</span>
                <span className="text-sm font-mono text-gray-900 flex-1 break-all">{String(v)}</span>
                <CopyButton text={String(v)} />
              </div>
            ))}
            {Object.keys(parsed.params).length > 0 && (
              <div className="rounded border border-gray-200 bg-gray-50 p-2">
                <span className="text-sm font-medium text-gray-600">{t('params_label')}</span>
                {Object.entries(parsed.params).map(([k, v]) => (
                  <div key={k} className="flex items-center gap-2 ml-4 mt-1">
                    <span className="text-sm font-mono text-blue-600">{k}</span>
                    <span className="text-sm text-gray-400">=</span>
                    <span className="text-sm font-mono text-gray-900">{v}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : url && <p className="text-sm text-red-600">{t('error_invalid')}</p>}
      </div>
    </ToolLayout>
  );
}
