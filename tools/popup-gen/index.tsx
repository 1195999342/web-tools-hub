'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Input from '../../components/ui/Input';
import Toggle from '../../components/ui/Toggle';
import CopyButton from '../../components/ui/CopyButton';
import { generatePopupCode, type PopupOptions } from './logic';
import type { ToolMeta } from '../registry';

export default function PopupGenTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.popup-gen');
  const [opts, setOpts] = useState<PopupOptions>({ url: 'https://example.com', width: 800, height: 600, toolbar: false, menubar: false, scrollbars: true, resizable: true, location: false });

  const code = generatePopupCode(opts);
  const update = (key: keyof PopupOptions, val: any) => setOpts(prev => ({ ...prev, [key]: val }));

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <Input label="URL" value={opts.url} onChange={e => update('url', e.target.value)} />
        <div className="grid grid-cols-2 gap-4">
          <Input label="Width" type="number" value={opts.width} onChange={e => update('width', Number(e.target.value))} />
          <Input label="Height" type="number" value={opts.height} onChange={e => update('height', Number(e.target.value))} />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <Toggle label="Toolbar" checked={opts.toolbar} onChange={v => update('toolbar', v)} />
          <Toggle label="Menubar" checked={opts.menubar} onChange={v => update('menubar', v)} />
          <Toggle label="Scrollbars" checked={opts.scrollbars} onChange={v => update('scrollbars', v)} />
          <Toggle label="Resizable" checked={opts.resizable} onChange={v => update('resizable', v)} />
          <Toggle label="Location" checked={opts.location} onChange={v => update('location', v)} />
        </div>
        <div className="relative">
          <pre className="rounded-md border bg-gray-900 text-gray-100 p-4 text-sm font-mono whitespace-pre-wrap">{code}</pre>
          <div className="mt-2 flex justify-end"><CopyButton text={code} /></div>
        </div>
      </div>
    </ToolLayout>
  );
}
