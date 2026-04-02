'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Textarea from '../../components/ui/Textarea';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import CopyButton from '../../components/ui/CopyButton';
import type { ToolMeta } from '../registry';
import { parseCurl, toJavaScript, toPython } from './logic';

const LANGS = [{ value: 'javascript', label: 'JavaScript' }, { value: 'python', label: 'Python' }];

export default function CurlConverterTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.curl-converter');
  const [input, setInput] = useState('');
  const [lang, setLang] = useState('javascript');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const handleConvert = () => {
    setError(''); setOutput('');
    const parsed = parseCurl(input);
    if (!parsed) { setError(t('error_invalid')); return; }
    if (lang === 'javascript') setOutput(toJavaScript(parsed));
    else if (lang === 'python') setOutput(toPython(parsed));
  };

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <Textarea value={input} onChange={e => setInput(e.target.value)} placeholder={t('input_placeholder')} rows={6} />
        <Select label={t('language_label')} options={LANGS} value={lang} onChange={e => setLang(e.target.value)} />
        <Button onClick={handleConvert}>{t('convert_button')}</Button>
        {error && <p className="text-sm text-red-600">{error}</p>}
        {output && (
          <div className="relative">
            <pre className="rounded-md border border-gray-200 bg-gray-50 p-4 text-sm text-gray-900 whitespace-pre-wrap overflow-auto">{output}</pre>
            <div className="mt-2 flex justify-end"><CopyButton text={output} /></div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
