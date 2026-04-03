'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import CodeEditor from '../../components/ui/CodeEditor';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { evaluateXPath } from './logic';
import type { ToolMeta } from '../registry';

export default function XpathTesterTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.xpath-tester');
  const [xml, setXml] = useState(`<bookstore>\n  <book category="fiction">\n    <title>The Great Gatsby</title>\n    <author>F. Scott Fitzgerald</author>\n  </book>\n  <book category="science">\n    <title>A Brief History of Time</title>\n    <author>Stephen Hawking</author>\n  </book>\n</bookstore>`);
  const [xpath, setXpath] = useState('//book[@category="fiction"]/title');
  const [results, setResults] = useState<string[]>([]);
  const [error, setError] = useState('');

  function handleEvaluate() {
    const r = evaluateXPath(xml, xpath);
    setResults(r.results);
    setError(r.error || '');
  }

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <CodeEditor label="XML" value={xml} onChange={setXml} showLineNumbers rows={10} />
        <Input label="XPath Expression" value={xpath} onChange={e => setXpath(e.target.value)} />
        <Button onClick={handleEvaluate}>Evaluate</Button>
        {error && <p className="text-sm text-red-600">{error}</p>}
        {results.length > 0 && (
          <div className="border rounded-md bg-gray-50 p-4">
            <p className="text-sm text-gray-600 mb-2">{results.length} match(es)</p>
            {results.map((r, i) => (
              <pre key={i} className="text-sm font-mono bg-white border rounded p-2 mb-2 whitespace-pre-wrap">{r}</pre>
            ))}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
