'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Textarea from '../../components/ui/Textarea';
import Tabs from '../../components/ui/Tabs';
import CopyButton from '../../components/ui/CopyButton';
import CodeEditor from '../../components/ui/CodeEditor';
import { parseCurl, toLanguage, langList, type Lang } from './logic';
import type { ToolMeta } from '../registry';

export default function CurlAllLangsTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.curl-all-langs');
  const [curl, setCurl] = useState(`curl -X POST https://api.example.com/data -H "Content-Type: application/json" -d '{"key":"value"}'`);
  const [tab, setTab] = useState<Lang>('python');

  const parsed = parseCurl(curl);
  const code = toLanguage(parsed, tab);
  const tabs = langList.map(l => ({ id: l.value, label: l.label }));

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <Textarea label="curl command" value={curl} onChange={e => setCurl(e.target.value)} rows={4} placeholder="curl -X GET https://..." />
        <Tabs tabs={tabs} activeTab={tab} onTabChange={id => setTab(id as Lang)} />
        <div className="relative">
          <CodeEditor value={code} readOnly showLineNumbers />
          <div className="mt-2 flex justify-end"><CopyButton text={code} /></div>
        </div>
      </div>
    </ToolLayout>
  );
}
