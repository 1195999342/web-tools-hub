'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import CopyButton from '../../components/ui/CopyButton';
import { generateRobotsTxt, type RobotsRule } from './logic';
import type { ToolMeta } from '../registry';

const emptyRule = (): RobotsRule => ({ userAgent: '*', allow: [''], disallow: ['/admin/'] });

export default function RobotsGenTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.robots-gen');
  const [rules, setRules] = useState<RobotsRule[]>([emptyRule()]);
  const [sitemap, setSitemap] = useState('');

  const output = generateRobotsTxt(rules, sitemap);

  function updateRule(idx: number, field: keyof RobotsRule, value: any) {
    setRules(prev => prev.map((r, i) => i === idx ? { ...r, [field]: value } : r));
  }

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        {rules.map((rule, ri) => (
          <div key={ri} className="border rounded-md p-4 flex flex-col gap-3 bg-gray-50">
            <div className="flex items-center justify-between">
              <span className="font-medium text-sm">Rule {ri + 1}</span>
              {rules.length > 1 && <Button variant="ghost" size="sm" onClick={() => setRules(prev => prev.filter((_, i) => i !== ri))}>Remove</Button>}
            </div>
            <Input label="User-Agent" value={rule.userAgent} onChange={e => updateRule(ri, 'userAgent', e.target.value)} />
            <div>
              <span className="text-sm font-medium text-gray-700">Disallow paths</span>
              {rule.disallow.map((d, di) => (
                <div key={di} className="flex items-center gap-2 mt-1">
                  <Input value={d} onChange={e => { const arr = [...rule.disallow]; arr[di] = e.target.value; updateRule(ri, 'disallow', arr); }} placeholder="/path/" />
                  <Button variant="ghost" size="sm" onClick={() => updateRule(ri, 'disallow', rule.disallow.filter((_, i) => i !== di))}>×</Button>
                </div>
              ))}
              <Button variant="ghost" size="sm" onClick={() => updateRule(ri, 'disallow', [...rule.disallow, ''])}>+ Add Disallow</Button>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">Allow paths</span>
              {rule.allow.map((a, ai) => (
                <div key={ai} className="flex items-center gap-2 mt-1">
                  <Input value={a} onChange={e => { const arr = [...rule.allow]; arr[ai] = e.target.value; updateRule(ri, 'allow', arr); }} placeholder="/path/" />
                  <Button variant="ghost" size="sm" onClick={() => updateRule(ri, 'allow', rule.allow.filter((_, i) => i !== ai))}>×</Button>
                </div>
              ))}
              <Button variant="ghost" size="sm" onClick={() => updateRule(ri, 'allow', [...rule.allow, ''])}>+ Add Allow</Button>
            </div>
          </div>
        ))}
        <Button variant="secondary" onClick={() => setRules(prev => [...prev, emptyRule()])}>+ Add Rule</Button>
        <Input label="Sitemap URL" value={sitemap} onChange={e => setSitemap(e.target.value)} placeholder="https://example.com/sitemap.xml" />
        <div className="relative">
          <pre className="rounded-md border border-gray-200 bg-gray-900 text-gray-100 p-4 text-sm font-mono whitespace-pre-wrap">{output}</pre>
          <div className="mt-2 flex justify-end"><CopyButton text={output} /></div>
        </div>
      </div>
    </ToolLayout>
  );
}
