'use client';

import { useState, useRef } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import FileDropzone from '../../components/ui/FileDropzone';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import Input from '../../components/ui/Input';
import type { ToolMeta } from '../registry';
import { cropImage, ASPECT_RATIOS, type CropRect } from './logic';

export default function ImageCropTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.image-crop');
  const [imgSrc, setImgSrc] = useState('');
  const [result, setResult] = useState('');
  const [crop, setCrop] = useState<CropRect>({ x: 0, y: 0, width: 200, height: 200 });
  const imgRef = useRef<HTMLImageElement>(null);

  const handleFile = (files: File[]) => {
    if (!files[0]) return;
    const reader = new FileReader();
    reader.onload = () => setImgSrc(reader.result as string);
    reader.readAsDataURL(files[0]);
  };

  const handleCrop = () => {
    if (!imgRef.current) return;
    setResult(cropImage(imgRef.current, crop));
  };

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <FileDropzone onFiles={handleFile} accept="image/*" label={t('drop_label')} />
        {imgSrc && (
          <>
            <img ref={imgRef} src={imgSrc} alt="Source" className="max-h-64 object-contain" />
            <div className="grid grid-cols-4 gap-2">
              <Input label="X" type="number" value={String(crop.x)} onChange={e => setCrop(p => ({ ...p, x: +e.target.value }))} />
              <Input label="Y" type="number" value={String(crop.y)} onChange={e => setCrop(p => ({ ...p, y: +e.target.value }))} />
              <Input label={t('width_label')} type="number" value={String(crop.width)} onChange={e => setCrop(p => ({ ...p, width: +e.target.value }))} />
              <Input label={t('height_label')} type="number" value={String(crop.height)} onChange={e => setCrop(p => ({ ...p, height: +e.target.value }))} />
            </div>
            <Button onClick={handleCrop}>{t('crop_button')}</Button>
          </>
        )}
        {result && <img src={result} alt="Cropped" className="max-h-64 object-contain border border-gray-200 rounded" />}
      </div>
    </ToolLayout>
  );
}
