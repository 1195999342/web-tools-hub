'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import CopyButton from '../../components/ui/CopyButton';
import CodeEditor from '../../components/ui/CodeEditor';
import { generateCode, languages, type Language } from './logic';
import type { ToolMeta } from '../registry';

export default function RegexCodegenTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.regex-codegen');
  const [regex, setRegex] = useState('^[a-zA-Z0-9]+$');
  const [flags, setFlags] = useState('g');
  const [lang, setLang] = useState<Language>('javascript');

  const code = generateCode(regex, flags, lang);

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2"><Input label="Regex Pattern" value={regex} onChange={e => setRegex(e.target.value)} placeholder="^[a-z]+$" /></div>
          <Input label="Flags" value={flags} onChange={e => setFlags(e.target.value)} placeholder="gi" />
        </div>
        <Select label="Language" options={languages} value={lang} onChange={e => setLang(e.target.value as Language)} />
        <div className="relative">
          <CodeEditor value={code} readOnly showLineNumbers label="Generated Code" />
          <div className="mt-2 flex justify-end"><CopyButton text={code} /></div>
        </div>
      </div>
    </ToolLayout>
  );
}
