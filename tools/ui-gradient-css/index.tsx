'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import ColorPicker from '../../components/ui/ColorPicker';
import Slider from '../../components/ui/Slider';
import CopyButton from '../../components/ui/CopyButton';
import { generateGradientCSS, generateSteppedGradient } from './logic';
import type { ToolMeta } from '../registry';

export default function UiGradientCssTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.ui-gradient-css');
  const [color1, setColor1] = useState('#3B82F6');
  const [color2, setColor2] = useState('#EC4899');
  const [angle, setAngle] = useState(90);
  const [steps, setSteps] = useState(5);

  const css = generateGradientCSS(color1, color2, angle);
  const steppedColors = generateSteppedGradient(color1, color2, steps);

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <ColorPicker label="Color 1" value={color1} onChange={setColor1} />
          <ColorPicker label="Color 2" value={color2} onChange={setColor2} />
        </div>
        <Slider label="Angle" min={0} max={360} value={angle} onChange={setAngle} />
        <Slider label="Steps" min={2} max={20} value={steps} onChange={setSteps} />
        <div className="h-24 rounded-md border" style={{ background: `linear-gradient(${angle}deg, ${color1}, ${color2})` }} />
        <div className="flex gap-1">
          {steppedColors.map((c, i) => (
            <div key={i} className="flex-1 h-12 rounded-sm cursor-pointer" style={{ backgroundColor: c }} title={c} onClick={() => navigator.clipboard.writeText(c)} />
          ))}
        </div>
        <div className="relative">
          <pre className="rounded-md border bg-gray-900 text-gray-100 p-4 text-sm font-mono">{css}</pre>
          <div className="mt-2 flex justify-end"><CopyButton text={css} /></div>
        </div>
      </div>
    </ToolLayout>
  );
}
