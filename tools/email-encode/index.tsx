'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Input from '../../components/ui/Input';
import CopyButton from '../../components/ui/CopyButton';
import type { ToolMeta } from '../registry';
import { encodeEmailHtml, encodeEmailJs, encodeEmailCss } from './logic';

export default function EmailEncodeTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.email-encode');
  const [email, setEmail] = useState('');
  const html = email ? encodeEmailHtml(email) : '';
  const js = email ? encodeEmailJs(email) : '';
  const css = email ? encodeEmailCss(email) : '';
  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <Input label={t('email_label')} value={email} onChange={e => setEmail(e.target.value)} placeholder="user@example.com" type="email" />
        {email && (
          <div className="space-y-3">
            {[{ label: 'HTML Entities', val: html }, { label: 'JavaScript', val: js }, { label: 'CSS/Data', val: css }].map(r => (
              <div key={r.label} className="flex flex-col gap-1">
                <span className="text-sm font-medium">{r.label}</span>
                <div className="flex items-start gap-2"><code className="flex-1 rounded border bg-gray-50 p-2 text-xs break-all">{r.val}</code><CopyButton text={r.val} /></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
