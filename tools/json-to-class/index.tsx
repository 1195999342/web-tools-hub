'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Textarea from '../../components/ui/Textarea';
import Select from '../../components/ui/Select';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import CopyButton from '../../components/ui/CopyButton';
import CodeEditor from '../../components/ui/CodeEditor';
import { generateTypeScript, generateJava, generateGo, generatePython, generateCSharp } from './logic';
import type { ToolMeta } from '../../tools/registry';

interface Props { locale: string; toolMeta: ToolMeta; }

const LANGUAGES = [
  { value: 'typescript', label: 'TypeScript' },
  { value: 'java', label: 'Java' },
  { value: 'go', label: 'Go' },
  { value: 'python', label: 'Python' },
  { value: 'csharp', label: 'C#' },
];

const generators: Record<string, (json: string, root: string) => { output?: string; error?: string }> = {
  typescript: generateTypeScript,
  java: generateJava,
  go: generateGo,
  python: generatePython,
  csharp: generateCSharp,
};

export default function JsonToClassTool({ locale, toolMeta }: Props) {
  const t = useTranslations('tools.json-to-class');
  const [input, setInput] = useState('');
  const [language, setLanguage] = useState('typescript');
  const [rootName, setRootName] = useState('Root');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  function handleGenerate() {
    setError('');
    setOutput('');
    const fn = generators[language];
    if (!fn) return;
    const result = fn(input, rootName || 'Root');
    if (result.error) setError(result.error);
    else setOutput(result.output ?? '');
  }

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <Textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder={t('input_placeholder')} rows={8} />

        <div className="flex gap-4">
          <Select label={t('language_label')} options={LANGUAGES} value={language} onChange={(e) => setLanguage(e.target.value)} />
          <Input label={t('root_name_label')} value={rootName} onChange={(e) => setRootName(e.target.value)} placeholder="Root" />
        </div>

        <Button onClick={handleGenerate}>{t('generate_button')}</Button>

        {error && <p className="text-sm text-red-600" role="alert">{error}</p>}

        {output && (
          <div>
            <CodeEditor value={output} readOnly showLineNumbers rows={12} />
            <div className="mt-2 flex justify-end"><CopyButton text={output} /></div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
