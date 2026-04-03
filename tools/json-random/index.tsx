'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Button from '../../components/ui/Button';
import CopyButton from '../../components/ui/CopyButton';
import Input from '../../components/ui/Input';
import type { ToolMeta } from '../registry';
import { generateRandomJSON } from './logic';

export default function JsonRandomTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.json-random');
  const [depth, setDepth] = useState(3);
  const [fields, setFields] = useState(4);
  const [output, setOutput] = useState('');

  const handleGenerate = () => {
    const data = generateRandomJSON(Math.min(depth, 6), Math.min(fields, 10));
    setOutput(JSON.stringify(data, null, 2));
  };

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <div className="flex gap-4">
          <Input label={t('depth_label')} type="number" value={depth} onChange={e => setDepth(Number(e.target.value))} min={1} max={6} />
          <Input label={t('fields_label')} type="number" value={fields} onChange={e => setFields(Number(e.target.value))} min={1} max={10} />
        </div>
        <Button onClick={handleGenerate}>{t('generate_button')}</Button>
        {output && (
          <div className="relative">
            <pre className="rounded-md border border-gray-200 bg-gray-50 p-4 text-sm text-gray-900 whitespace-pre-wrap overflow-auto max-h-[500px]">{output}</pre>
            <div className="mt-2 flex justify-end"><CopyButton text={output} /></div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
