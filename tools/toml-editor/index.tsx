'use client';
import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import CodeEditor from '../../components/ui/CodeEditor';
import CopyButton from '../../components/ui/CopyButton';
import type { ToolMeta } from '../registry';
import { tomlToJson, validateToml } from './logic';

const SAMPLE = `# Example TOML
title = "My Project"
version = "1.0.0"

[owner]
name = "John Doe"
age = 35

[database]
server = "192.168.1.1"
ports = [8001, 8001, 8002]
enabled = true`;

export default function TomlEditorTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.toml-editor');
  const [toml, setToml] = useState(SAMPLE);
  const validation = useMemo(() => validateToml(toml), [toml]);
  const jsonResult = useMemo(() => tomlToJson(toml), [toml]);

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <span className={`text-sm px-2 py-1 rounded ${validation.valid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {validation.valid ? '✓ Valid TOML' : '✗ Invalid TOML'}
          </span>
          {validation.error && <span className="text-xs text-red-500 truncate max-w-md">{validation.error}</span>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CodeEditor label="TOML" value={toml} onChange={setToml} showLineNumbers rows={14} />
          <div className="relative">
            <CodeEditor label="JSON Preview" value={jsonResult.json || jsonResult.error || ''} readOnly showLineNumbers rows={14} />
            {jsonResult.json && <div className="mt-2 flex justify-end"><CopyButton text={jsonResult.json} /></div>}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
