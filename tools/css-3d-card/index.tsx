'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Select from '../../components/ui/Select';
import Slider from '../../components/ui/Slider';
import CopyButton from '../../components/ui/CopyButton';
import { generate3DCardCSS, type FlipDirection } from './logic';
import type { ToolMeta } from '../registry';

export default function Css3dCardTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.css-3d-card');
  const [direction, setDirection] = useState<FlipDirection>('horizontal');
  const [speed, setSpeed] = useState(0.6);
  const { html, css } = generate3DCardCSS(direction, speed);
  const axis = direction === 'horizontal' ? 'Y' : 'X';

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <Select label="Flip Direction" options={[{ value: 'horizontal', label: 'Horizontal' }, { value: 'vertical', label: 'Vertical' }]} value={direction} onChange={e => setDirection(e.target.value as FlipDirection)} />
          <Slider label="Speed (seconds)" min={0.2} max={2} step={0.1} value={speed} onChange={setSpeed} />
        </div>
        <div className="flex items-center justify-center p-8 bg-gray-100 rounded-md">
          <div style={{ width: 300, height: 200, perspective: 1000 }}>
            <style>{`.card-preview:hover .card-inner { transform: rotate${axis}(180deg); }`}</style>
            <div className="card-preview" style={{ width: '100%', height: '100%' }}>
              <div className="card-inner" style={{ width: '100%', height: '100%', position: 'relative', transformStyle: 'preserve-3d', transition: `transform ${speed}s ease` }}>
                <div style={{ position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold', background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)', color: 'white' }}>Front</div>
                <div style={{ position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold', background: 'linear-gradient(135deg, #10B981, #3B82F6)', color: 'white', transform: `rotate${axis}(180deg)` }}>Back</div>
              </div>
            </div>
          </div>
        </div>
        <div className="relative">
          <pre className="rounded-md border bg-gray-900 text-gray-100 p-4 text-sm font-mono whitespace-pre-wrap max-h-64 overflow-auto">{`<!-- HTML -->\n${html}\n\n/* CSS */\n${css}`}</pre>
          <div className="mt-2 flex justify-end"><CopyButton text={`${html}\n\n${css}`} /></div>
        </div>
      </div>
    </ToolLayout>
  );
}
