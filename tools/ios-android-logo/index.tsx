'use client';
import { useState, useRef } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import FileDropzone from '../../components/ui/FileDropzone';
import Button from '../../components/ui/Button';
import { iconSizes, resizeImage } from './logic';
import type { ToolMeta } from '../registry';

export default function IosAndroidLogoTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.ios-android-logo');
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [icons, setIcons] = useState<{ name: string; platform: string; size: number; url: string }[]>([]);

  function handleFiles(files: File[]) {
    const file = files[0];
    if (!file) return;
    const img = new Image();
    img.onload = () => { imgRef.current = img; setLoaded(true); };
    img.src = URL.createObjectURL(file);
  }

  function handleGenerate() {
    if (!imgRef.current) return;
    const results = iconSizes.map(s => ({ ...s, url: resizeImage(imgRef.current!, s.size) }));
    setIcons(results);
  }

  function download(url: string, name: string, size: number) {
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name.replace(/\s+/g, '_')}_${size}.png`;
    a.click();
  }

  function downloadAll() {
    icons.forEach(i => download(i.url, i.name, i.size));
  }

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <FileDropzone onFiles={handleFiles} accept="image/*" label="Drop your app icon image here" />
        {loaded && <Button onClick={handleGenerate}>Generate All Sizes</Button>}
        {icons.length > 0 && (
          <>
            <Button variant="secondary" onClick={downloadAll}>Download All</Button>
            {['iOS', 'Android'].map(platform => (
              <div key={platform}>
                <h3 className="font-semibold text-gray-800 mb-2">{platform}</h3>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
                  {icons.filter(i => i.platform === platform).map(i => (
                    <div key={i.name} className="flex flex-col items-center gap-1 border rounded-md p-2 cursor-pointer hover:bg-gray-50" onClick={() => download(i.url, i.name, i.size)}>
                      <img src={i.url} alt={i.name} style={{ width: Math.min(i.size, 48), height: Math.min(i.size, 48) }} />
                      <span className="text-[10px] text-gray-600 text-center">{i.name}</span>
                      <span className="text-[10px] text-gray-400">{i.size}px</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </ToolLayout>
  );
}
