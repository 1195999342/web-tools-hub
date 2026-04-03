'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import ColorPicker from '../../components/ui/ColorPicker';
import Button from '../../components/ui/Button';
import CopyButton from '../../components/ui/CopyButton';
import { formatColor } from './logic';
import type { ToolMeta } from '../registry';

export default function ColorPickerToolTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.color-picker-tool');
  const [color, setColor] = useState('#3B82F6');
  const [palette, setPalette] = useState<string[]>([]);

  const info = formatColor(color);

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <ColorPicker label="Pick a Color" value={color} onChange={setColor} />
        <div className="grid grid-cols-3 gap-3 text-sm">
          <div className="border rounded-md p-3"><span className="text-gray-500">HEX</span><div className="font-mono mt-1">{info.hex}</div><CopyButton text={info.hex} /></div>
          <div className="border rounded-md p-3"><span className="text-gray-500">RGB</span><div className="font-mono mt-1">{info.rgb}</div><CopyButton text={info.rgb} /></div>
          <div className="border rounded-md p-3"><span className="text-gray-500">HSL</span><div className="font-mono mt-1">{info.hsl}</div><CopyButton text={info.hsl} /></div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-20 h-20 rounded-md border" style={{ backgroundColor: color }} />
          <Button onClick={() => setPalette(prev => prev.includes(color) ? prev : [...prev, color])}>Add to Palette</Button>
        </div>
        {palette.length > 0 && (
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-gray-700">Palette</span>
            <div className="flex flex-wrap gap-2">
              {palette.map(c => (
                <div key={c} className="flex items-center gap-1 border rounded-md px-2 py-1">
                  <div className="w-6 h-6 rounded" style={{ backgroundColor: c }} />
                  <span className="text-xs font-mono">{c}</span>
                  <CopyButton text={c} />
                  <button onClick={() => setPalette(prev => prev.filter(x => x !== c))} className="text-gray-400 hover:text-red-500 text-xs ml-1">×</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
