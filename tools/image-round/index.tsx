'use client';
import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import FileDropzone from '../../components/ui/FileDropzone';
import Slider from '../../components/ui/Slider';
import Button from '../../components/ui/Button';
import { applyRoundCorners } from './logic';
import type { ToolMeta } from '../registry';

export default function ImageRoundTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.image-round');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [radius, setRadius] = useState(30);

  function handleFiles(files: File[]) {
    const file = files[0];
    if (!file) return;
    const img = new Image();
    img.onload = () => { imgRef.current = img; setLoaded(true); };
    img.src = URL.createObjectURL(file);
  }

  useEffect(() => {
    if (loaded && canvasRef.current && imgRef.current) applyRoundCorners(canvasRef.current, imgRef.current, radius);
  }, [radius, loaded]);

  function handleDownload() {
    if (!canvasRef.current) return;
    const a = document.createElement('a');
    a.href = canvasRef.current.toDataURL('image/png');
    a.download = 'rounded.png';
    a.click();
  }

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <FileDropzone onFiles={handleFiles} accept="image/*" label="Drop an image here" />
        {loaded && (
          <>
            <Slider label="Border Radius" min={0} max={300} value={radius} onChange={setRadius} />
            <canvas ref={canvasRef} className="max-w-full border rounded-md" style={{ maxHeight: 400, background: 'repeating-conic-gradient(#ccc 0% 25%, white 0% 50%) 50% / 20px 20px' }} />
            <Button onClick={handleDownload}>Download PNG</Button>
          </>
        )}
        {!loaded && <canvas ref={canvasRef} className="hidden" />}
      </div>
    </ToolLayout>
  );
}
