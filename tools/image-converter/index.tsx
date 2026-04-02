'use client';

import { useState, useRef } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import FileDropzone from '../../components/ui/FileDropzone';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import type { ToolMeta } from '../registry';
import { FORMATS, convertImage, downloadDataUrl } from './logic';

export default function ImageConverterTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.image-converter');
  const [imgSrc, setImgSrc] = useState('');
  const [format, setFormat] = useState('image/png');
  const [fileName, setFileName] = useState('image');
  const imgRef = useRef<HTMLImageElement>(null);

  const handleFile = (files: File[]) => {
    if (!files[0]) return;
    setFileName(files[0].name.replace(/\.[^.]+$/, ''));
    const reader = new FileReader();
    reader.onload = () => setImgSrc(reader.result as string);
    reader.readAsDataURL(files[0]);
  };

  const handleConvert = () => {
    if (!imgRef.current) return;
    const dataUrl = convertImage(imgRef.current, format);
    const ext = FORMATS.find(f => f.value === format)?.ext || 'png';
    downloadDataUrl(dataUrl, `${fileName}.${ext}`);
  };

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <FileDropzone onFiles={handleFile} accept="image/*" label={t('drop_label')} />
        {imgSrc && <img ref={imgRef} src={imgSrc} alt="Source" className="max-h-48 object-contain" />}
        <Select label={t('format_label')} options={FORMATS.map(f => ({ value: f.value, label: f.label }))} value={format} onChange={e => setFormat(e.target.value)} />
        <Button onClick={handleConvert} disabled={!imgSrc}>{t('convert_button')}</Button>
      </div>
    </ToolLayout>
  );
}
