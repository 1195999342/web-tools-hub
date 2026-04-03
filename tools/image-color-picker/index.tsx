'use client';
import { useState, useRef, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import FileDropzone from '../../components/ui/FileDropzone';
import CopyButton from '../../components/ui/CopyButton';
import { getPixelColor, drawImageToCanvas } from './logic';
import type { ToolMeta } from '../registry';

export default function ImageColorPickerTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.image-color-picker');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [pickedColor, setPickedColor] = useState<{ hex: string; rgb: string } | null>(null);

  const handleFiles = useCallback((files: File[]) => {
    const file = files[0];
    if (!file) return;
    const img = new Image();
    img.onload = () => {
      if (canvasRef.current) { drawImageToCanvas(canvasRef.current, img); setLoaded(true); }
    };
    img.src = URL.createObjectURL(file);
  }, []);

  function handleCanvasClick(e: React.MouseEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = Math.floor((e.clientX - rect.left) * scaleX);
    const y = Math.floor((e.clientY - rect.top) * scaleY);
    setPickedColor(getPixelColor(canvas, x, y));
  }

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <FileDropzone onFiles={handleFiles} accept="image/*" label="Drop an image here or click to upload" />
        <canvas ref={canvasRef} onClick={handleCanvasClick} className={`max-w-full border rounded-md ${loaded ? 'cursor-crosshair' : 'hidden'}`} style={{ maxHeight: 400, objectFit: 'contain' }} />
        {pickedColor && (
          <div className="flex items-center gap-4 border rounded-md p-4 bg-gray-50">
            <div className="w-16 h-16 rounded-md border" style={{ backgroundColor: pickedColor.hex }} />
            <div className="flex flex-col gap-1 text-sm">
              <div className="flex items-center gap-2"><span className="font-mono">{pickedColor.hex}</span><CopyButton text={pickedColor.hex} /></div>
              <div className="flex items-center gap-2"><span className="font-mono">{pickedColor.rgb}</span><CopyButton text={pickedColor.rgb} /></div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
