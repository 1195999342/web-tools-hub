'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Input from '../../components/ui/Input';
import ColorPicker from '../../components/ui/ColorPicker';
import CopyButton from '../../components/ui/CopyButton';
import Tabs from '../../components/ui/Tabs';
import { generateNeonCSS, generateGlitchCSS } from './logic';
import type { ToolMeta } from '../registry';

export default function CssNeonGlitchTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.css-neon-glitch');
  const [text, setText] = useState('NEON');
  const [color, setColor] = useState('#00ffff');
  const [mode, setMode] = useState('neon');

  const css = mode === 'neon' ? generateNeonCSS(text, color) : generateGlitchCSS(text, color);

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <Tabs tabs={[{ id: 'neon', label: 'Neon' }, { id: 'glitch', label: 'Glitch' }]} activeTab={mode} onTabChange={setMode} />
        <div className="grid grid-cols-2 gap-4">
          <Input label="Text" value={text} onChange={e => setText(e.target.value)} />
          <ColorPicker label="Color" value={color} onChange={setColor} />
        </div>
        <div className="flex items-center justify-center h-40 rounded-md bg-gray-900 overflow-hidden">
          {mode === 'neon' ? (
            <span style={{ fontSize: '3rem', fontWeight: 'bold', color, textShadow: `0 0 7px ${color}, 0 0 10px ${color}, 0 0 21px ${color}, 0 0 42px ${color}` }}>{text}</span>
          ) : (
            <span style={{ fontSize: '3rem', fontWeight: 'bold', color, position: 'relative' }} className="animate-pulse">{text}</span>
          )}
        </div>
        <div className="relative">
          <pre className="rounded-md border border-gray-200 bg-gray-900 text-gray-100 p-4 text-sm font-mono whitespace-pre-wrap max-h-64 overflow-auto">{css}</pre>
          <div className="mt-2 flex justify-end"><CopyButton text={css} /></div>
        </div>
      </div>
    </ToolLayout>
  );
}
