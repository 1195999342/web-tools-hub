'use client';
import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Input from '../../components/ui/Input';
import ColorPicker from '../../components/ui/ColorPicker';
import Button from '../../components/ui/Button';
import { generatePlaceholder } from './logic';
import type { ToolMeta } from '../registry';

export default function PlaceholderImageTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.placeholder-image');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [width, setWidth] = useState(400);
  const [height, setHeight] = useState(300);
  const [bgColor, setBgColor] = useState('#cccccc');
  const [textColor, setTextColor] = useState('#666666');
  const [text, setText] = useState('');

  useEffect(() => {
    if (canvasRef.current) generatePlaceholder(canvasRef.current, width, height, bgColor, textColor, text);
  }, [width, height, bgColor, textColor, text]);

  function handleDownload() {
    if (!canvasRef.current) return;
    const a = document.createElement('a');
    a.href = canvasRef.current.toDataURL('image/png');
    a.download = `placeholder_${width}x${height}.png`;
    a.click();
  }

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <Input label="Width" type="number" value={width} onChange={e => setWidth(Number(e.target.value))} />
          <Input label="Height" type="number" value={height} onChange={e => setHeight(Number(e.target.value))} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <ColorPicker label="Background" value={bgColor} onChange={setBgColor} />
          <ColorPicker label="Text Color" value={textColor} onChange={setTextColor} />
        </div>
        <Input label="Text (optional)" value={text} onChange={e => setText(e.target.value)} placeholder="Leave empty for WxH" />
        <canvas ref={canvasRef} className="max-w-full border rounded-md" style={{ maxHeight: 300 }} />
        <Button onClick={handleDownload}>Download PNG</Button>
      </div>
    </ToolLayout>
  );
}
