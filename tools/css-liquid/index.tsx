'use client';
import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import ColorPicker from '../../components/ui/ColorPicker';
import Slider from '../../components/ui/Slider';
import Button from '../../components/ui/Button';
import CopyButton from '../../components/ui/CopyButton';
import { generateLiquidCSS } from './logic';
import type { ToolMeta } from '../registry';

export default function CssLiquidTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.css-liquid');
  const [color1, setColor1] = useState('#3B82F6');
  const [color2, setColor2] = useState('#8B5CF6');
  const [complexity, setComplexity] = useState(40);
  const [speed, setSpeed] = useState(4);
  const [key, setKey] = useState(0);

  const css = useMemo(() => generateLiquidCSS(color1, color2, complexity, speed), [color1, color2, complexity, speed, key]);

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <ColorPicker label="Color 1" value={color1} onChange={setColor1} />
          <ColorPicker label="Color 2" value={color2} onChange={setColor2} />
        </div>
        <Slider label="Complexity" min={10} max={70} value={complexity} onChange={setComplexity} />
        <Slider label="Speed (seconds)" min={1} max={10} value={speed} onChange={setSpeed} />
        <Button variant="secondary" onClick={() => setKey(k => k + 1)}>Regenerate</Button>
        <div className="flex items-center justify-center p-8 bg-gray-100 rounded-md">
          <style>{css}</style>
          <div className="liquid-blob" />
        </div>
        <div className="relative">
          <pre className="rounded-md border bg-gray-900 text-gray-100 p-4 text-sm font-mono whitespace-pre-wrap max-h-48 overflow-auto">{css}</pre>
          <div className="mt-2 flex justify-end"><CopyButton text={css} /></div>
        </div>
      </div>
    </ToolLayout>
  );
}
