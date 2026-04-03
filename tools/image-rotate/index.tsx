'use client';
import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import FileDropzone from '../../components/ui/FileDropzone';
import Button from '../../components/ui/Button';
import Slider from '../../components/ui/Slider';
import { rotateImage } from './logic';
import type { ToolMeta } from '../registry';

export default function ImageRotateTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.image-rotate');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [degrees, setDegrees] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);

  function handleFiles(files: File[]) {
    const file = files[0];
    if (!file) return;
    const img = new Image();
    img.onload = () => { imgRef.current = img; setLoaded(true); };
    img.src = URL.createObjectURL(file);
  }

  useEffect(() => {
    if (loaded && canvasRef.current && imgRef.current) rotateImage(canvasRef.current, imgRef.current, degrees, flipH, flipV);
  }, [degrees, flipH, flipV, loaded]);

  function handleDownload() {
    if (!canvasRef.current) return;
    const a = document.createElement('a');
    a.href = canvasRef.current.toDataURL('image/png');
    a.download = 'rotated.png';
    a.click();
  }

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <FileDropzone onFiles={handleFiles} accept="image/*" label="Drop an image here" />
        {loaded && (
          <>
            <div className="flex flex-wrap gap-2">
              {[0, 90, 180, 270].map(d => (
                <Button key={d} variant={degrees === d ? 'primary' : 'secondary'} size="sm" onClick={() => setDegrees(d)}>{d}°</Button>
              ))}
              <Button variant={flipH ? 'primary' : 'secondary'} size="sm" onClick={() => setFlipH(!flipH)}>Flip H</Button>
              <Button variant={flipV ? 'primary' : 'secondary'} size="sm" onClick={() => setFlipV(!flipV)}>Flip V</Button>
            </div>
            <Slider label="Custom Angle" min={0} max={360} value={degrees} onChange={setDegrees} />
            <canvas ref={canvasRef} className="max-w-full border rounded-md" style={{ maxHeight: 400 }} />
            <Button onClick={handleDownload}>Download</Button>
          </>
        )}
        {!loaded && <canvas ref={canvasRef} className="hidden" />}
      </div>
    </ToolLayout>
  );
}
