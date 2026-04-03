'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Input from '../../components/ui/Input';
import CopyButton from '../../components/ui/CopyButton';
import { invertColor } from './logic';
import type { ToolMeta } from '../registry';

export default function InverseColorTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.inverse-color');
  const [color, setColor] = useState('#3366cc');
  const inverted = invertColor(color);

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <div className="flex gap-3 items-end">
          <Input label="Color (hex)" value={color} onChange={e => setColor(e.target.value)} placeholder="#3366cc" />
          <input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-12 h-11 rounded border border-gray-300 cursor-pointer" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="w-full h-24 rounded-md border border-gray-200" style={{ backgroundColor: color }} />
            <p className="text-sm font-mono mt-2 text-gray-700">{color}</p>
            <p className="text-xs text-gray-500">Original</p>
          </div>
          <div className="text-center">
            <div className="w-full h-24 rounded-md border border-gray-200" style={{ backgroundColor: inverted }} />
            <p className="text-sm font-mono mt-2 text-gray-700">{inverted}</p>
            <p className="text-xs text-gray-500">Complementary</p>
            <div className="mt-1 flex justify-center"><CopyButton text={inverted} /></div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
