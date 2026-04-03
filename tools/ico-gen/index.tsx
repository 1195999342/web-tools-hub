'use client';
import { useState, useRef } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import FileDropzone from '../../components/ui/FileDropzone';
import Button from '../../components/ui/Button';
import { ICO_SIZES, resizeToCanvas, canvasToDataUrl } from './logic';
import type { ToolMeta } from '../registry';

export default function IcoGenTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.ico-gen');
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState<number[]>([16, 32, 48, 64]);
  const [previews, setPreviews] = useState<{ size: number; url: string }[]>([]);

  function handleFiles(files: File[]) {
    const file = files[0];
    if (!file) return;
    const img = new Image();
    img.onload = () => { imgRef.current = img; setLoaded(true); generatePreviews(img); };
    img.src = URL.createObjectURL(file);
  }

  function generatePreviews(img: HTMLImageElement) {
    const results = selectedSizes.map(size => {
      const canvas = resizeToCanvas(img, size);
      return { size, url: canvasToDataUrl(canvas) };
    });
    setPreviews(results);
  }

  function toggleSize(size: number) {
    setSelectedSizes(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size].sort((a, b) => a - b));
  }

  function handleGenerate() {
    if (imgRef.current) generatePreviews(imgRef.current);
  }

  function downloadSize(url: string, size: number) {
    const a = document.createElement('a');
    a.href = url;
    a.download = `icon_${size}x${size}.png`;
    a.click();
  }

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <FileDropzone onFiles={handleFiles} accept="image/*" label="Drop an image here" />
        <div className="flex flex-wrap gap-2">
          {ICO_SIZES.map(s => (
            <button key={s} onClick={() => toggleSize(s)} className={`px-3 py-1 rounded-md text-sm border ${selectedSizes.includes(s) ? 'bg-blue-100 border-blue-500 text-blue-700' : 'border-gray-300'}`}>{s}×{s}</button>
          ))}
        </div>
        {loaded && <Button onClick={handleGenerate}>Generate</Button>}
        {previews.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
            {previews.map(p => (
              <div key={p.size} className="flex flex-col items-center gap-2 border rounded-md p-3 cursor-pointer hover:bg-gray-50" onClick={() => downloadSize(p.url, p.size)}>
                <img src={p.url} alt={`${p.size}px`} style={{ width: Math.min(p.size, 64), height: Math.min(p.size, 64), imageRendering: 'pixelated' }} />
                <span className="text-xs text-gray-600">{p.size}×{p.size}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
