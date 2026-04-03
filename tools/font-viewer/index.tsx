'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import FileDropzone from '../../components/ui/FileDropzone';
import Input from '../../components/ui/Input';
import Slider from '../../components/ui/Slider';
import { loadFontFromFile } from './logic';
import type { ToolMeta } from '../registry';

export default function FontViewerTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.font-viewer');
  const [fontName, setFontName] = useState('');
  const [text, setText] = useState('The quick brown fox jumps over the lazy dog. 0123456789');
  const [size, setSize] = useState(32);
  const [fileName, setFileName] = useState('');

  async function handleFiles(files: File[]) {
    const file = files[0];
    if (!file) return;
    try {
      const name = await loadFontFromFile(file);
      setFontName(name);
      setFileName(file.name);
    } catch { /* invalid font */ }
  }

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <FileDropzone onFiles={handleFiles} accept=".ttf,.otf,.woff,.woff2" label="Drop a font file (.ttf, .otf, .woff, .woff2)" />
        {fileName && <p className="text-sm text-gray-600">Loaded: {fileName}</p>}
        <Input label="Preview Text" value={text} onChange={e => setText(e.target.value)} />
        <Slider label="Font Size" min={8} max={120} value={size} onChange={setSize} />
        {fontName && (
          <div className="border rounded-md p-6 bg-white min-h-[120px]" style={{ fontFamily: fontName, fontSize: `${size}px`, lineHeight: 1.4, wordBreak: 'break-word' }}>
            {text}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
