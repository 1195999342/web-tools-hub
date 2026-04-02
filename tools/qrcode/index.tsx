'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Textarea from '../../components/ui/Textarea';
import Input from '../../components/ui/Input';
import ColorPicker from '../../components/ui/ColorPicker';
import type { ToolMeta } from '../../tools/registry';

interface Props { locale: string; toolMeta: ToolMeta; }

export default function QrCodeTool({ locale, toolMeta }: Props) {
  const t = useTranslations('tools.qrcode');
  const [text, setText] = useState('');
  const [size, setSize] = useState(256);
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <Textarea
          label={t('text_label')}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t('text_placeholder')}
          rows={4}
        />
        <div className="flex flex-wrap items-end gap-4">
          <div className="w-32">
            <Input
              label={t('size_label')}
              type="number"
              min={64}
              max={1024}
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
            />
          </div>
          <ColorPicker label={t('fg_color')} value={fgColor} onChange={setFgColor} />
          <ColorPicker label={t('bg_color')} value={bgColor} onChange={setBgColor} />
        </div>
        <div className="rounded-md border border-gray-200 bg-gray-50 p-8 flex items-center justify-center min-h-[200px]">
          <p className="text-gray-400 text-sm">{t('coming_soon')}</p>
        </div>
      </div>
    </ToolLayout>
  );
}
