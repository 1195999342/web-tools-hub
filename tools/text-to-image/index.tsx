'use client';
import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Textarea from '../../components/ui/Textarea';
import Slider from '../../components/ui/Slider';
import ColorPicker from '../../components/ui/ColorPicker';
import Button from '../../components/ui/Button';
import { renderTextToCanvas } from './logic';
import type { ToolMeta } from '../registry';

export default function TextToImageTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.text-to-image');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [text, setText] = useState('Hello World!\nText to Image');
  const [fontSize, setFontSize] = useState(32);
  const [textColor, setTextColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');

  useEffect(() => {
    if (canvasRef.current) renderTextToCanvas(canvasRef.current, text, fontSize, textColor, bgColor);
  }, [text, fontSize, textColor, bgColor]);

  function handleDownload() {
    if (!canvasRef.current) return;
    const a = document.createElement('a');
    a.href = canvasRef.current.toDataURL('image/png');
    a.download = 'text-image.png';
    a.click();
  }

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <Textarea label="Text" value={text} onChange={e => setText(e.target.value)} rows={4} />
        <Slider label="Font Size" min={12} max={120} value={fontSize} onChange={setFontSize} />
        <div className="grid grid-cols-2 gap-4">
          <ColorPicker label="Text Color" value={textColor} onChange={setTextColor} />
          <ColorPicker label="Background" value={bgColor} onChange={setBgColor} />
        </div>
        <canvas ref={canvasRef} className="max-w-full border rounded-md" />
        <Button onClick={handleDownload}>Download PNG</Button>
      </div>
    </ToolLayout>
  );
}
