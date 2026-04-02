'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Input from '../../components/ui/Input';
import CopyButton from '../../components/ui/CopyButton';
import type { ToolMeta } from '../registry';
import { generateMetaTags, type MetaConfig } from './logic';

const INIT: MetaConfig = { title: '', description: '', keywords: '', author: '', ogTitle: '', ogDescription: '', ogImage: '', ogUrl: '', twitterCard: 'summary', twitterTitle: '', twitterDescription: '' };

export default function MetaGeneratorTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.meta-generator');
  const [config, setConfig] = useState<MetaConfig>(INIT);
  const output = generateMetaTags(config);
  const update = (key: keyof MetaConfig, val: string) => setConfig(prev => ({ ...prev, [key]: val }));

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-3">
        <Input label={t('title_label')} value={config.title} onChange={e => update('title', e.target.value)} />
        <Input label={t('description_label')} value={config.description} onChange={e => update('description', e.target.value)} />
        <Input label={t('keywords_label')} value={config.keywords} onChange={e => update('keywords', e.target.value)} />
        <Input label={t('author_label')} value={config.author} onChange={e => update('author', e.target.value)} />
        <Input label="OG Title" value={config.ogTitle} onChange={e => update('ogTitle', e.target.value)} />
        <Input label="OG Description" value={config.ogDescription} onChange={e => update('ogDescription', e.target.value)} />
        <Input label="OG Image URL" value={config.ogImage} onChange={e => update('ogImage', e.target.value)} />
        <Input label="OG URL" value={config.ogUrl} onChange={e => update('ogUrl', e.target.value)} />
        {output && (
          <div className="relative">
            <pre className="rounded-md border border-gray-200 bg-gray-50 p-4 text-sm text-gray-900 whitespace-pre-wrap">{output}</pre>
            <div className="mt-2 flex justify-end"><CopyButton text={output} /></div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
