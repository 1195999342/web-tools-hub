'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '../../components/ui/ToolLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Toggle from '../../components/ui/Toggle';
import type { ToolMeta } from '../registry';
import { generateMaze, solveMaze, type Cell } from './logic';

export default function MazeGenTool({ locale, toolMeta }: { locale: string; toolMeta: ToolMeta }) {
  const t = useTranslations('tools.maze-gen');
  const [width, setWidth] = useState(15);
  const [height, setHeight] = useState(15);
  const [grid, setGrid] = useState<Cell[][] | null>(null);
  const [solution, setSolution] = useState<[number, number][]>([]);
  const [showSolution, setShowSolution] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const draw = useCallback(() => {
    if (!grid || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const cellSize = Math.min(Math.floor(600 / Math.max(width, height)), 40);
    canvas.width = width * cellSize;
    canvas.height = height * cellSize;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (showSolution && solution.length > 0) {
      ctx.strokeStyle = '#3B82F6';
      ctx.lineWidth = cellSize * 0.3;
      ctx.lineCap = 'round';
      ctx.beginPath();
      solution.forEach(([r, c], i) => {
        const x = c * cellSize + cellSize / 2;
        const y = r * cellSize + cellSize / 2;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      });
      ctx.stroke();
    }

    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 2;
    for (let r = 0; r < height; r++) {
      for (let c = 0; c < width; c++) {
        const x = c * cellSize, y = r * cellSize;
        const cell = grid[r][c];
        if (cell.top) { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + cellSize, y); ctx.stroke(); }
        if (cell.right) { ctx.beginPath(); ctx.moveTo(x + cellSize, y); ctx.lineTo(x + cellSize, y + cellSize); ctx.stroke(); }
        if (cell.bottom) { ctx.beginPath(); ctx.moveTo(x, y + cellSize); ctx.lineTo(x + cellSize, y + cellSize); ctx.stroke(); }
        if (cell.left) { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + cellSize); ctx.stroke(); }
      }
    }
    // Start and end markers
    ctx.fillStyle = '#22C55E';
    ctx.fillRect(2, 2, cellSize - 4, cellSize - 4);
    ctx.fillStyle = '#EF4444';
    ctx.fillRect((width - 1) * cellSize + 2, (height - 1) * cellSize + 2, cellSize - 4, cellSize - 4);
  }, [grid, width, height, showSolution, solution]);

  useEffect(() => { draw(); }, [draw]);

  function handleGenerate() {
    const w = Math.max(3, Math.min(30, width));
    const h = Math.max(3, Math.min(30, height));
    const g = generateMaze(w, h);
    setGrid(g);
    setSolution(solveMaze(g, w, h));
    setShowSolution(false);
  }

  return (
    <ToolLayout toolMeta={toolMeta} locale={locale as any} instructions={t('instructions')}>
      <div className="flex flex-col gap-4">
        <div className="flex gap-4 items-end flex-wrap">
          <div className="w-24"><Input label="Width" type="number" value={String(width)} onChange={e => setWidth(Number(e.target.value))} /></div>
          <div className="w-24"><Input label="Height" type="number" value={String(height)} onChange={e => setHeight(Number(e.target.value))} /></div>
          <Button onClick={handleGenerate}>Generate Maze</Button>
          {grid && <Toggle label="Show Solution" checked={showSolution} onChange={setShowSolution} />}
        </div>
        {grid && (
          <div className="flex justify-center overflow-auto p-4 bg-white border border-gray-200 rounded-lg">
            <canvas ref={canvasRef} />
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
