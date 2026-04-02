'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import CopyButton from '../../components/ui/CopyButton';
import type { ToolMeta } from '../registry';
import { generateBadgeUrl, generateMarkdown, STYLES, COLORS, type BadgeConfig } from './logic';

export default function ShieldBadgeTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.shield-badge');
  const [config, setConfig] = useState<BadgeConfig>({ label: 'build', message: 'passing', color: 'brightgreen', style: 'flat', labelColor: '555' });
  const url = generateBadgeUrl(config);
  const md = generateMarkdown(url, `${config.label}-${config.message}`);
  const update = (key: keyof BadgeConfig, val: string) => setConfig(prev => ({ ...prev, [key]: val }));

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <div className="flex justify-center py-4">
          <img src={url} alt="Badge preview" className="h-8" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input label={t('label_field')} value={config.label} onChange={e => update('label', e.target.value)} />
          <Input label={t('message_field')} value={config.message} onChange={e => update('message', e.target.value)} />
        </div>
        <Select label={t('color_label')} options={COLORS.map(c => ({ value: c, label: c }))} value={config.color} onChange={e => update('color', e.target.value)} />
        <Select label={t('style_label')} options={STYLES.map(s => ({ value: s, label: s }))} value={config.style} onChange={e => update('style', e.target.value)} />
        <div className="space-y-2">
          <div className="flex items-center gap-2"><span className="text-sm text-gray-500">URL:</span><code className="text-xs break-all flex-1">{url}</code><CopyButton text={url} /></div>
          <div className="flex items-center gap-2"><span className="text-sm text-gray-500">Markdown:</span><code className="text-xs break-all flex-1">{md}</code><CopyButton text={md} /></div>
        </div>
      </div>
    </ToolLayout>
  );
}
