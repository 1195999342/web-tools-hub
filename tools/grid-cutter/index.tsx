'use client';
import { useState, useRef } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import FileDropzone from '../../components/ui/FileDropzone';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import { cutImageToGrid } from './logic';
import type { ToolMeta } from '../registry';

export default function GridCutterTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.grid-cutter');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imgSrc, setImgSrc] = useState('');
  const [grid, setGrid] = useState('2x2');
  const [pieces, setPieces] = useState<string[]>([]);
  const imgRef = useRef<HTMLImageElement | null>(null);

  function handleFiles(files: File[]) {
    const file = files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImgSrc(url);
    setPieces([]);
    const img = new Image();
    img.onload = () => { imgRef.current = img; };
    img.src = url;
  }

  function handleCut() {
    if (!canvasRef.current || !imgRef.current) return;
    const [c, r] = grid.split('x').map(Number);
    const result = cutImageToGrid(canvasRef.current, imgRef.current, c, r);
    setPieces(result);
  }

  function downloadPiece(dataUrl: string, idx: number) {
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `piece_${idx + 1}.png`;
    a.click();
  }

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <FileDropzone onFiles={handleFiles} accept="image/*" label="Drop an image here" />
        <canvas ref={canvasRef} className="hidden" />
        {imgSrc && <img src={imgSrc} alt="Preview" className="max-w-full max-h-64 rounded-md border" />}
        <div className="flex items-end gap-4">
          <Select label="Grid" options={[{ value: '2x2', label: '2×2' }, { value: '3x3', label: '3×3' }, { value: '4x4', label: '4×4' }]} value={grid} onChange={e => setGrid(e.target.value)} />
          <Button onClick={handleCut} disabled={!imgSrc}>Cut</Button>
        </div>
        {pieces.length > 0 && (
          <div className="grid grid-cols-4 gap-2">
            {pieces.map((p, i) => (
              <div key={i} className="border rounded-md overflow-hidden cursor-pointer hover:ring-2 ring-blue-500" onClick={() => downloadPiece(p, i)}>
                <img src={p} alt={`Piece ${i + 1}`} className="w-full" />
              </div>
            ))}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
