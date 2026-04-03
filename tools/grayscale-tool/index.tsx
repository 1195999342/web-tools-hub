'use client';
import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import FileDropzone from '../../components/ui/FileDropzone';
import Toggle from '../../components/ui/Toggle';
import Slider from '../../components/ui/Slider';
import Button from '../../components/ui/Button';
import { applyGrayscale } from './logic';
import type { ToolMeta } from '../registry';

export default function GrayscaleToolTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.grayscale-tool');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [bw, setBw] = useState(false);
  const [threshold, setThreshold] = useState(128);

  function handleFiles(files: File[]) {
    const file = files[0];
    if (!file) return;
    const img = new Image();
    img.onload = () => { imgRef.current = img; setLoaded(true); };
    img.src = URL.createObjectURL(file);
  }

  useEffect(() => {
    if (loaded && canvasRef.current && imgRef.current) applyGrayscale(canvasRef.current, imgRef.current, bw, threshold);
  }, [bw, threshold, loaded]);

  function handleDownload() {
    if (!canvasRef.current) return;
    const a = document.createElement('a');
    a.href = canvasRef.current.toDataURL('image/png');
    a.download = 'grayscale.png';
    a.click();
  }

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <FileDropzone onFiles={handleFiles} accept="image/*" label="Drop an image here" />
        {loaded && (
          <>
            <Toggle label="Black & White (threshold)" checked={bw} onChange={setBw} />
            {bw && <Slider label="Threshold" min={0} max={255} value={threshold} onChange={setThreshold} />}
            <canvas ref={canvasRef} className="max-w-full border rounded-md" style={{ maxHeight: 400 }} />
            <Button onClick={handleDownload}>Download</Button>
          </>
        )}
        {!loaded && <canvas ref={canvasRef} className="hidden" />}
      </div>
    </ToolLayout>
  );
}
