'use client';
import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import FileDropzone from '../../components/ui/FileDropzone';
import Input from '../../components/ui/Input';
import Slider from '../../components/ui/Slider';
import Select from '../../components/ui/Select';
import ColorPicker from '../../components/ui/ColorPicker';
import Button from '../../components/ui/Button';
import { applyWatermark, type WatermarkPosition } from './logic';
import type { ToolMeta } from '../registry';

export default function ImageWatermarkTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.image-watermark');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [text, setText] = useState('Watermark');
  const [fontSize, setFontSize] = useState(48);
  const [color, setColor] = useState('#ffffff');
  const [opacity, setOpacity] = useState(0.5);
  const [position, setPosition] = useState<WatermarkPosition>('center');

  function handleFiles(files: File[]) {
    const file = files[0];
    if (!file) return;
    const img = new Image();
    img.onload = () => { imgRef.current = img; setLoaded(true); redraw(img); };
    img.src = URL.createObjectURL(file);
  }

  function redraw(img?: HTMLImageElement) {
    const i = img || imgRef.current;
    if (!canvasRef.current || !i) return;
    applyWatermark(canvasRef.current, i, text, fontSize, color, opacity, position);
  }

  useEffect(() => { if (loaded) redraw(); }, [text, fontSize, color, opacity, position, loaded]);

  function handleDownload() {
    if (!canvasRef.current) return;
    const a = document.createElement('a');
    a.href = canvasRef.current.toDataURL('image/png');
    a.download = 'watermarked.png';
    a.click();
  }

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <FileDropzone onFiles={handleFiles} accept="image/*" label="Drop an image here" />
        {loaded && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Watermark Text" value={text} onChange={e => setText(e.target.value)} />
              <ColorPicker label="Color" value={color} onChange={setColor} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Slider label="Font Size" min={12} max={200} value={fontSize} onChange={setFontSize} />
              <Slider label="Opacity" min={0.1} max={1} step={0.05} value={opacity} onChange={setOpacity} />
            </div>
            <Select label="Position" options={[{ value: 'center', label: 'Center' }, { value: 'top-left', label: 'Top Left' }, { value: 'top-right', label: 'Top Right' }, { value: 'bottom-left', label: 'Bottom Left' }, { value: 'bottom-right', label: 'Bottom Right' }]} value={position} onChange={e => setPosition(e.target.value as WatermarkPosition)} />
            <canvas ref={canvasRef} className="max-w-full border rounded-md" style={{ maxHeight: 400 }} />
            <Button onClick={handleDownload}>Download</Button>
          </>
        )}
        {!loaded && <canvas ref={canvasRef} className="hidden" />}
      </div>
    </ToolLayout>
  );
}
