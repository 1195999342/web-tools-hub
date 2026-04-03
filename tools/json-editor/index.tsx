'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Textarea from '../../components/ui/Textarea';
import Button from '../../components/ui/Button';
import CopyButton from '../../components/ui/CopyButton';
import type { ToolMeta } from '../registry';
import { formatJSON, minifyJSON, validateJSON } from './logic';

export default function JsonEditorTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.json-editor');
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [valid, setValid] = useState<boolean | null>(null);

  const handleFormat = () => { const r = formatJSON(input); if (r.error) setError(r.error); else { setInput(r.output!); setError(''); } };
  const handleMinify = () => { const r = minifyJSON(input); if (r.error) setError(r.error); else { setInput(r.output!); setError(''); } };
  const handleValidate = () => { const r = validateJSON(input); setValid(r.valid); setError(r.error ?? ''); };

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <Textarea value={input} onChange={e => { setInput(e.target.value); setValid(null); setError(''); }} placeholder={t('input_placeholder')} rows={12} className="font-mono" />
        <div className="flex gap-2 flex-wrap">
          <Button onClick={handleFormat}>{t('format_button')}</Button>
          <Button onClick={handleMinify} variant="secondary">{t('minify_button')}</Button>
          <Button onClick={handleValidate} variant="ghost">{t('validate_button')}</Button>
          <CopyButton text={input} />
        </div>
        {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
        {valid === true && <p className="text-sm text-green-600">✓ Valid JSON</p>}
      </div>
    </ToolLayout>
  );
}
