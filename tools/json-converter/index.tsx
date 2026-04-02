'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Textarea from '../../components/ui/Textarea';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import CopyButton from '../../components/ui/CopyButton';
import {
  jsonToYaml, yamlToJson, jsonToXml, xmlToJson,
  jsonToToml, tomlToJson, jsonToCsv, csvToJson,
} from './logic';
import type { ToolMeta } from '../../tools/registry';

interface Props { locale: string; toolMeta: ToolMeta; }

const FORMATS = ['json', 'yaml', 'xml', 'toml', 'csv'] as const;
type Format = typeof FORMATS[number];

const converters: Record<string, (input: string) => { output?: string; error?: string }> = {
  'json→yaml': jsonToYaml,
  'yaml→json': yamlToJson,
  'json→xml': jsonToXml,
  'xml→json': xmlToJson,
  'json→toml': jsonToToml,
  'toml→json': tomlToJson,
  'json→csv': jsonToCsv,
  'csv→json': csvToJson,
};

export default function JsonConverterTool({ locale, toolMeta }: Props) {
  const t = useTranslations('tools.json-converter');
  const [source, setSource] = useState<Format>('json');
  const [target, setTarget] = useState<Format>('yaml');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const sourceOptions = FORMATS.map((f) => ({ value: f, label: t(`format_${f}`) }));
  const targetOptions = FORMATS.filter((f) => f !== source).map((f) => ({ value: f, label: t(`format_${f}`) }));

  function handleConvert() {
    setError('');
    setOutput('');
    const key = `${source}→${target}`;
    const fn = converters[key];
    if (!fn) {
      setError(t('error_unsupported'));
      return;
    }
    const result = fn(input);
    if (result.error) setError(result.error);
    else setOutput(result.output ?? '');
  }

  function handleSourceChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newSource = e.target.value as Format;
    setSource(newSource);
    if (newSource === target) {
      const alt = FORMATS.find((f) => f !== newSource);
      if (alt) setTarget(alt);
    }
  }

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <div className="flex gap-4">
          <Select label={t('source_label')} options={sourceOptions} value={source} onChange={handleSourceChange} />
          <Select label={t('target_label')} options={targetOptions} value={target} onChange={(e) => setTarget(e.target.value as Format)} />
        </div>

        <Textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder={t('input_placeholder')} rows={8} />

        <Button onClick={handleConvert}>{t('convert_button')}</Button>

        {error && <p className="text-sm text-red-600" role="alert">{error}</p>}

        {output && (
          <div className="relative">
            <pre className="rounded-md border border-gray-200 bg-gray-50 p-4 overflow-auto text-sm text-gray-900 whitespace-pre-wrap break-all">
              <code>{output}</code>
            </pre>
            <div className="mt-2 flex justify-end"><CopyButton text={output} /></div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
