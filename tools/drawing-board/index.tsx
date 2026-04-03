'use client';
import { useState, useRef, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import ColorPicker from '../../components/ui/ColorPicker';
import Slider from '../../components/ui/Slider';
import Toggle from '../../components/ui/Toggle';
import Button from '../../components/ui/Button';
import { initCanvas, clearCanvas, drawLine, type DrawState } from './logic';
import type { ToolMeta } from '../registry';

export default function DrawingBoardTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.drawing-board');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(4);
  const [eraser, setEraser] = useState(false);
  const [inited, setInited] = useState(false);

  const ensureInit = useCallback(() => {
    if (!inited && canvasRef.current) {
      initCanvas(canvasRef.current, 800, 500);
      setInited(true);
    }
  }, [inited]);

  function getPos(e: React.MouseEvent<HTMLCanvasElement>) {
    const rect = canvasRef.current!.getBoundingClientRect();
    const scaleX = canvasRef.current!.width / rect.width;
    const scaleY = canvasRef.current!.height / rect.height;
    return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
  }

  function handleMouseDown(e: React.MouseEvent<HTMLCanvasElement>) {
    ensureInit();
    setDrawing(true);
    lastPos.current = getPos(e);
  }

  function handleMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
    if (!drawing || !lastPos.current || !canvasRef.current) return;
    const pos = getPos(e);
    drawLine(canvasRef.current, lastPos.current.x, lastPos.current.y, pos.x, pos.y, { color, brushSize, eraser });
    lastPos.current = pos;
  }

  function handleMouseUp() { setDrawing(false); lastPos.current = null; }

  function handleClear() { if (canvasRef.current) clearCanvas(canvasRef.current); }

  function handleDownload() {
    if (!canvasRef.current) return;
    const a = document.createElement('a');
    a.href = canvasRef.current.toDataURL('image/png');
    a.download = 'drawing.png';
    a.click();
  }

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-end gap-4">
          <ColorPicker label="Color" value={color} onChange={setColor} />
          <Slider label="Brush Size" min={1} max={50} value={brushSize} onChange={setBrushSize} className="w-48" />
          <Toggle label="Eraser" checked={eraser} onChange={setEraser} />
        </div>
        <canvas ref={canvasRef} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp} className="w-full border rounded-md cursor-crosshair bg-white" style={{ maxHeight: 500 }} width={800} height={500} />
        <div className="flex gap-3">
          <Button variant="secondary" onClick={handleClear}>Clear</Button>
          <Button onClick={handleDownload}>Download PNG</Button>
        </div>
      </div>
    </ToolLayout>
  );
}
