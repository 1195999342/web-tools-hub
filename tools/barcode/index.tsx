'use client';
import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Input from '../../components/ui/Input';
import type { ToolMeta } from '../registry';
import { encodeCode128 } from './logic';

export default function BarcodeTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.barcode');
  const [text, setText] = useState('Hello 123');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !text) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const bars = encodeCode128(text);
    const barWidth = 2;
    canvas.width = bars.length * barWidth + 20;
    canvas.height = 80;
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < bars.length; i++) {
      if (bars[i] === '1') {
        ctx.fillStyle = '#000';
        ctx.fillRect(10 + i * barWidth, 5, barWidth, 60);
      }
    }
    ctx.fillStyle = '#000';
    ctx.font = '12px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(text, canvas.width / 2, 78);
  }, [text]);

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4 items-center">
        <Input label={t('text_label')} value={text} onChange={e => setText(e.target.value)} placeholder={t('text_placeholder')} />
        <canvas ref={canvasRef} className="border border-gray-200 rounded" />
      </div>
    </ToolLayout>
  );
}
