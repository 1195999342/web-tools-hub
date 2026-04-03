'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import CodeEditor from '../../components/ui/CodeEditor';
import Button from '../../components/ui/Button';
import CopyButton from '../../components/ui/CopyButton';
import { filterHTML, type FilterMode } from './logic';
import type { ToolMeta } from '../registry';

const sample = `<!DOCTYPE html>
<html>
<head>
  <style>body { color: red; } h1 { font-size: 2em; }</style>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <h1>Hello World</h1>
  <p>Some text content here.</p>
  <script>console.log("Hello!");</script>
  <script src="app.js"></script>
</body>
</html>`;

export default function HtmlCssJsFilterTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.html-css-js-filter');
  const [html, setHtml] = useState(sample);
  const [mode, setMode] = useState<FilterMode>('js');
  const [output, setOutput] = useState('');

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <CodeEditor label="HTML Input" value={html} onChange={setHtml} showLineNumbers rows={10} />
        <div className="flex gap-3">
          {(['js', 'css', 'text'] as FilterMode[]).map(m => (
            <Button key={m} variant={mode === m ? 'primary' : 'secondary'} size="sm" onClick={() => setMode(m)}>
              {m === 'js' ? 'Extract JS' : m === 'css' ? 'Extract CSS' : 'Extract Text'}
            </Button>
          ))}
        </div>
        <Button onClick={() => setOutput(filterHTML(html, mode))}>Filter</Button>
        {output && (
          <div className="relative">
            <CodeEditor label="Output" value={output} readOnly showLineNumbers rows={10} />
            <div className="mt-2 flex justify-end"><CopyButton text={output} /></div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
