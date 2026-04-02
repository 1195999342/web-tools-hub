'use client';

import { useState, useRef } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import FileDropzone from '../../components/ui/FileDropzone';
import Slider from '../../components/ui/Slider';
import Button from '../../components/ui/Button';
import type { ToolMeta } from '../registry';
import { compressImage, formatSize } from './logic';

export default function ImageCompressTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.image-compress');
  const [imgSrc, setImgSrc] = useState('');
  const [quality, setQuality] = useState(75);
  const [result, setResult] = useState<{ dataUrl: string; size: number } | null>(null);
  const [origSize, setOrigSize] = useState(0);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleFile = (files: File[]) => {
    if (!files[0]) return;
    setOrigSize(files[0].size);
    const reader = new FileReader();
    reader.onload = () => setImgSrc(reader.result as string);
    reader.readAsDataURL(files[0]);
  };

  const handleCompress = () => {
    if (!imgRef.current) return;
    setResult(compressImage(imgRef.current, quality));
  };

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <FileDropzone onFiles={handleFile} accept="image/*" label={t('drop_label')} />
        {imgSrc && <img ref={imgRef} src={imgSrc} alt="Source" className="max-h-48 object-contain" />}
        <Slider label={t('quality_label')} min={1} max={100} value={quality} onChange={setQuality} />
        <Button onClick={handleCompress}>{t('compress_button')}</Button>
        {result && (
          <div className="text-sm text-gray-700">
            <p>{t('original_size')}: {formatSize(origSize)} → {formatSize(result.size)}</p>
            <img src={result.dataUrl} alt="Compressed" className="max-h-48 object-contain mt-2" />
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
