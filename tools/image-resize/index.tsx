'use client';

import { useState, useRef } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import FileDropzone from '../../components/ui/FileDropzone';
import Input from '../../components/ui/Input';
import Toggle from '../../components/ui/Toggle';
import Button from '../../components/ui/Button';
import type { ToolMeta } from '../registry';
import { resizeImage, calcDimensions } from './logic';

export default function ImageResizeTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.image-resize');
  const [imgSrc, setImgSrc] = useState('');
  const [origW, setOrigW] = useState(0);
  const [origH, setOrigH] = useState(0);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [lock, setLock] = useState(true);
  const [result, setResult] = useState('');
  const imgRef = useRef<HTMLImageElement>(null);

  const handleFile = (files: File[]) => {
    if (!files[0]) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => { setOrigW(img.width); setOrigH(img.height); setWidth(img.width); setHeight(img.height); };
      img.src = reader.result as string;
      setImgSrc(reader.result as string);
    };
    reader.readAsDataURL(files[0]);
  };

  const handleWidthChange = (w: number) => {
    const d = calcDimensions(origW, origH, w, height, lock);
    setWidth(d.width); setHeight(d.height);
  };

  const handleResize = () => {
    if (!imgRef.current) return;
    setResult(resizeImage(imgRef.current, width, height));
  };

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <FileDropzone onFiles={handleFile} accept="image/*" label={t('drop_label')} />
        {imgSrc && <img ref={imgRef} src={imgSrc} alt="Source" className="max-h-48 object-contain" />}
        <div className="grid grid-cols-2 gap-4">
          <Input label={t('width_label')} type="number" value={String(width)} onChange={e => handleWidthChange(+e.target.value)} />
          <Input label={t('height_label')} type="number" value={String(height)} onChange={e => setHeight(+e.target.value)} />
        </div>
        <Toggle label={t('lock_aspect')} checked={lock} onChange={setLock} />
        <Button onClick={handleResize} disabled={!imgSrc}>{t('resize_button')}</Button>
        {result && <img src={result} alt="Resized" className="max-h-48 object-contain border border-gray-200 rounded" />}
      </div>
    </ToolLayout>
  );
}
