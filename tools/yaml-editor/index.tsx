'use client';
import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import CodeEditor from '../../components/ui/CodeEditor';
import CopyButton from '../../components/ui/CopyButton';
import type { ToolMeta } from '../registry';
import { yamlToJson, validateYaml } from './logic';

const SAMPLE = `name: John Doe
age: 30
active: true
address:
  street: 123 Main St
  city: Springfield
hobbies:
  - reading
  - coding
  - hiking`;

export default function YamlEditorTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.yaml-editor');
  const [yaml, setYaml] = useState(SAMPLE);
  const validation = useMemo(() => validateYaml(yaml), [yaml]);
  const jsonResult = useMemo(() => yamlToJson(yaml), [yaml]);

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <span className={`text-sm px-2 py-1 rounded ${validation.valid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {validation.valid ? '✓ Valid YAML' : '✗ Invalid YAML'}
          </span>
          {validation.error && <span className="text-xs text-red-500 truncate max-w-md">{validation.error}</span>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CodeEditor label="YAML" value={yaml} onChange={setYaml} showLineNumbers rows={14} />
          <div className="relative">
            <CodeEditor label="JSON Preview" value={jsonResult.json || jsonResult.error || ''} readOnly showLineNumbers rows={14} />
            {jsonResult.json && <div className="mt-2 flex justify-end"><CopyButton text={jsonResult.json} /></div>}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
