'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Textarea from '../../components/ui/Textarea';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import CopyButton from '../../components/ui/CopyButton';
import { generateConcat } from './logic';
import type { Language } from './logic';
import type { ToolMeta } from '../registry';

const LANGS = [
  {value:'javascript',label:'JavaScript'},{value:'python',label:'Python'},{value:'java',label:'Java'},
  {value:'csharp',label:'C#'},{value:'go',label:'Go'},{value:'php',label:'PHP'},{value:'ruby',label:'Ruby'},
];

export default function StringConcatTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.string-concat');
  const [input, setInput] = useState('Hello\nWorld\nFoo');
  const [lang, setLang] = useState<Language>('javascript');
  const [output, setOutput] = useState('');

  function handleGenerate() {
    const lines = input.split('\n').filter(l => l.length > 0);
    setOutput(generateConcat(lines, lang));
  }

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <Textarea label="Text (one line per string)" value={input} onChange={e => setInput(e.target.value)} rows={5} />
        <Select label="Language" options={LANGS} value={lang} onChange={e => setLang(e.target.value as Language)} />
        <Button onClick={handleGenerate}>Generate</Button>
        {output && (
          <div className="relative">
            <pre className="rounded-md border border-gray-200 bg-gray-900 text-gray-100 p-4 overflow-auto text-sm font-mono whitespace-pre-wrap">{output}</pre>
            <div className="mt-2 flex justify-end"><CopyButton text={output} /></div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
