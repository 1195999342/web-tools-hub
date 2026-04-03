'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Select from '../../components/ui/Select';
import Slider from '../../components/ui/Slider';
import Button from '../../components/ui/Button';
import type { ToolMeta } from '../registry';
import { drawGrid, type GridType } from './logic';

export default function GridPaperTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.grid-paper');
  const [gridType, setGridType] = useState<GridType>('square');
  const [cellSize, setCellSize] = useState(20);
  const [color, setColor] = useState('#cccccc');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const W = 600, H = 800;

  const render = useCallback(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d')!;
    drawGrid(ctx, W, H, gridType, cellSize, color);
  }, [gridType, cellSize, color]);

  useEffect(() => { render(); }, [render]);

  function handleDownload() {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `grid-paper-${gridType}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  }

  const typeOptions = [
    { value: 'square', label: 'Square Grid' },
    { value: 'lined', label: 'Lined' },
    { value: 'dot', label: 'Dot Grid' },
  ];

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <div className="flex gap-4 flex-wrap items-end">
          <div className="w-40"><Select label="Grid Type" options={typeOptions} value={gridType} onChange={e => setGridType(e.target.value as GridType)} /></div>
          <div className="w-48"><Slider label="Cell Size" min={8} max={50} value={cellSize} onChange={setCellSize} /></div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Color</label>
            <input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-[44px] h-[44px] rounded border border-gray-300 cursor-pointer" />
          </div>
          <Button onClick={handleDownload}>Download PNG</Button>
        </div>
        <div className="overflow-auto border border-gray-200 rounded-lg bg-white" style={{ maxHeight: 500 }}>
          <canvas ref={canvasRef} width={W} height={H} />
        </div>
      </div>
    </ToolLayout>
  );
}
