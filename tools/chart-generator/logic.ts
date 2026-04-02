export type ChartType = 'bar' | 'pie' | 'line';

export interface ChartData { labels: string[]; values: number[]; }

export function parseData(input: string): ChartData {
  const lines = input.trim().split('\n').filter(l => l.trim());
  const labels: string[] = [];
  const values: number[] = [];
  for (const line of lines) {
    const parts = line.split(/[,\t]/).map(s => s.trim());
    if (parts.length >= 2) {
      labels.push(parts[0]);
      values.push(parseFloat(parts[1]) || 0);
    }
  }
  return { labels, values };
}

const COLORS = ['#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316', '#14b8a6', '#6366f1'];

export function drawChart(canvas: HTMLCanvasElement, type: ChartType, data: ChartData) {
  const ctx = canvas.getContext('2d');
  if (!ctx || data.values.length === 0) return;
  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0, 0, w, h);
  const max = Math.max(...data.values, 1);

  if (type === 'bar') {
    const barW = (w - 60) / data.values.length;
    data.values.forEach((v, i) => {
      const barH = (v / max) * (h - 60);
      ctx.fillStyle = COLORS[i % COLORS.length];
      ctx.fillRect(40 + i * barW + 4, h - 30 - barH, barW - 8, barH);
      ctx.fillStyle = '#333';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(data.labels[i] || '', 40 + i * barW + barW / 2, h - 14);
    });
  } else if (type === 'pie') {
    const total = data.values.reduce((a, b) => a + b, 0) || 1;
    let angle = -Math.PI / 2;
    const cx = w / 2, cy = h / 2, r = Math.min(w, h) / 2 - 30;
    data.values.forEach((v, i) => {
      const slice = (v / total) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, angle, angle + slice);
      ctx.fillStyle = COLORS[i % COLORS.length];
      ctx.fill();
      angle += slice;
    });
  } else if (type === 'line') {
    const stepX = (w - 60) / Math.max(data.values.length - 1, 1);
    ctx.beginPath();
    ctx.strokeStyle = COLORS[0];
    ctx.lineWidth = 2;
    data.values.forEach((v, i) => {
      const x = 40 + i * stepX;
      const y = h - 30 - (v / max) * (h - 60);
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.stroke();
  }
}
