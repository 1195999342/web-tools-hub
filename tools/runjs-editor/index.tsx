'use client';
import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import CodeEditor from '../../components/ui/CodeEditor';
import Tabs from '../../components/ui/Tabs';
import Button from '../../components/ui/Button';
import { buildPreviewHTML } from './logic';
import type { ToolMeta } from '../registry';

export default function RunjsEditorTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.runjs-editor');
  const [html, setHtml] = useState('<h1>Hello World</h1>\n<p id="demo">Click the button</p>\n<button onclick="changeText()">Click Me</button>');
  const [css, setCss] = useState('body { font-family: sans-serif; padding: 20px; }\nh1 { color: #3B82F6; }');
  const [js, setJs] = useState('function changeText() {\n  document.getElementById("demo").textContent = "Button clicked!";\n}');
  const [tab, setTab] = useState('html');
  const [preview, setPreview] = useState('');

  function handleRun() { setPreview(buildPreviewHTML(html, css, js)); }

  const tabs = [{ id: 'html', label: 'HTML' }, { id: 'css', label: 'CSS' }, { id: 'js', label: 'JavaScript' }];

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <Tabs tabs={tabs} activeTab={tab} onTabChange={setTab} />
        {tab === 'html' && <CodeEditor value={html} onChange={setHtml} showLineNumbers rows={10} />}
        {tab === 'css' && <CodeEditor value={css} onChange={setCss} showLineNumbers rows={10} />}
        {tab === 'js' && <CodeEditor value={js} onChange={setJs} showLineNumbers rows={10} />}
        <Button onClick={handleRun}>Run</Button>
        {preview && (
          <div className="border rounded-md overflow-hidden">
            <iframe srcDoc={preview} className="w-full h-64 bg-white" sandbox="allow-scripts" title="Preview" />
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
