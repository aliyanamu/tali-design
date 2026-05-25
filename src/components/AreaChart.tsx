import { useRef, useEffect, useState } from 'react';

interface AreaChartProps {
  data: number[];
  height?: number;
  color?: string;
}

type Range = '1M' | '3M' | '1Y';

export function AreaChart({ data, height = 160, color = '#2E9E6B' }: AreaChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [range, setRange] = useState<Range>('1M');
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const ranges: Range[] = ['1M', '3M', '1Y'];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, rect.width, rect.height);

    const min = Math.min(...data);
    const max = Math.max(...data);
    const pad = 8;
    const w = rect.width;
    const h = rect.height - pad;

    const xStep = w / (data.length - 1);
    const yScale = (v: number) => h - pad - ((v - min) / (max - min)) * (h - pad * 2);

    // Area fill
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, color + '30');
    grad.addColorStop(0.6, color + '10');
    grad.addColorStop(1, color + '00');

    ctx.beginPath();
    ctx.moveTo(0, yScale(data[0]));
    for (let i = 1; i < data.length; i++) {
      const px = i * xStep;
      const py = yScale(data[i]);
      const prevX = (i - 1) * xStep;
      const prevY = yScale(data[i - 1]);
      const cpx = (prevX + px) / 2;
      ctx.bezierCurveTo(cpx, prevY, cpx, py, px, py);
    }
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // Line
    ctx.beginPath();
    ctx.moveTo(0, yScale(data[0]));
    for (let i = 1; i < data.length; i++) {
      const px = i * xStep;
      const py = yScale(data[i]);
      const prevX = (i - 1) * xStep;
      const prevY = yScale(data[i - 1]);
      const cpx = (prevX + px) / 2;
      ctx.bezierCurveTo(cpx, prevY, cpx, py, px, py);
    }
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.lineJoin = 'round';
    ctx.stroke();

    // Today dot
    const lastX = (data.length - 1) * xStep;
    const lastY = yScale(data[data.length - 1]);

    // Glow
    ctx.beginPath();
    ctx.arc(lastX, lastY, 6, 0, Math.PI * 2);
    ctx.fillStyle = color + '25';
    ctx.fill();

    // Dot
    ctx.beginPath();
    ctx.arc(lastX, lastY, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Hover crosshair
    if (hoverIdx !== null && hoverIdx < data.length) {
      const hx = hoverIdx * xStep;
      const hy = yScale(data[hoverIdx]);
      ctx.beginPath();
      ctx.setLineDash([3, 3]);
      ctx.moveTo(hx, pad);
      ctx.lineTo(hx, h);
      ctx.strokeStyle = color + '40';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.beginPath();
      ctx.arc(hx, hy, 4, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
  }, [data, color, height, hoverIdx]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const step = rect.width / (data.length - 1);
    const idx = Math.round(x / step);
    setHoverIdx(Math.max(0, Math.min(data.length - 1, idx)));
  };

  return (
    <div className="space-y-3">
      <canvas
        ref={canvasRef}
        className="w-full cursor-crosshair"
        style={{ height }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoverIdx(null)}
      />
      <div className="flex items-center gap-1">
        {ranges.map((r) => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg transition-colors ${
              range === r
                ? 'text-sign bg-sign/10'
                : 'text-ink-400 dark:text-ink-500 hover:text-ink-600 dark:hover:text-ink-300'
            }`}
          >
            {r}
          </button>
        ))}
      </div>
    </div>
  );
}
