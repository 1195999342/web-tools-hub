'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Textarea from '../../components/ui/Textarea';
import Button from '../../components/ui/Button';
import CopyButton from '../../components/ui/CopyButton';
import { decodeJwt } from './logic';
import type { ToolMeta } from '../../tools/registry';

interface Props { locale: string; toolMeta: ToolMeta; }

export default function JwtDecoderTool({ locale, toolMeta }: Props) {
  const t = useTranslations('tools.jwt-decoder');
  const [input, setInput] = useState('');
  const [header, setHeader] = useState('');
  const [payload, setPayload] = useState('');
  const [signature, setSignature] = useState('');
  const [timestamps, setTimestamps] = useState<{ field: string; value: number; readable: string }[]>([]);
  const [error, setError] = useState('');

  function handleDecode() {
    setError('');
    setHeader('');
    setPayload('');
    setSignature('');
    setTimestamps([]);
    const result = decodeJwt(input);
    if (result.error) {
      setError(result.error);
    } else if (result.output) {
      setHeader(result.output.header);
      setPayload(result.output.payload);
      setSignature(result.output.signature);
      setTimestamps(result.output.timestamps);
    }
  }

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <Textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder={t('input_placeholder')} rows={4} />
        <Button onClick={handleDecode}>{t('decode_button')}</Button>

        {error && <p className="text-sm text-red-600" role="alert">{error}</p>}

        {header && (
          <div className="flex flex-col gap-4">
            <Section title={t('header_label')} content={header} />
            <Section title={t('payload_label')} content={payload} />

            {timestamps.length > 0 && (
              <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">{t('timestamps_label')}</h3>
                <div className="space-y-1">
                  {timestamps.map((ts) => (
                    <div key={ts.field} className="text-sm text-gray-900">
                      <span className="font-mono font-medium">{ts.field}</span>: {ts.value} → <span className="text-blue-600">{ts.readable}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">{t('signature_label')}</h3>
              <p className="text-sm font-mono text-gray-900 break-all">{signature}</p>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

function Section({ title, content }: { title: string; content: string }) {
  return (
    <div className="relative">
      <h3 className="text-sm font-medium text-gray-700 mb-1">{title}</h3>
      <pre className="rounded-md border border-gray-200 bg-gray-50 p-4 overflow-auto text-sm text-gray-900 whitespace-pre-wrap break-all">
        <code>{content}</code>
      </pre>
      <div className="mt-1 flex justify-end"><CopyButton text={content} /></div>
    </div>
  );
}
