'use client';
import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import CodeEditor from '../../components/ui/CodeEditor';
import Button from '../../components/ui/Button';
import CopyButton from '../../components/ui/CopyButton';
import type { ToolMeta } from '../registry';
import { formatXml, minifyXml, validateXml } from './logic';

const SAMPLE = `<?xml version="1.0" encoding="UTF-8"?>
<bookstore><book category="fiction"><title>The Great Gatsby</title><author>F. Scott Fitzgerald</author><year>1925</year></book></bookstore>`;

export default function XmlEditorTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.xml-editor');
  const [xml, setXml] = useState(SAMPLE);
  const validation = useMemo(() => validateXml(xml), [xml]);

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <span className={`text-sm px-2 py-1 rounded ${validation.valid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {validation.valid ? '✓ Valid XML' : '✗ Invalid XML'}
          </span>
          {validation.error && <span className="text-xs text-red-500 truncate max-w-md">{validation.error}</span>}
        </div>
        <CodeEditor label="XML" value={xml} onChange={setXml} showLineNumbers rows={14} />
        <div className="flex gap-2 flex-wrap">
          <Button onClick={() => { const r = formatXml(xml); setXml(r.output); }}>Format</Button>
          <Button variant="secondary" onClick={() => { const r = minifyXml(xml); setXml(r.output); }}>Minify</Button>
          <CopyButton text={xml} />
        </div>
      </div>
    </ToolLayout>
  );
}
