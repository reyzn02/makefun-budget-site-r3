// Hearth & Ledger — canvas charts, drawn fresh on every render.
// Donut: spending by category for one month. Bars: three months of spending.

const PALETTE = [
  '#1d4a38', '#e8a13a', '#d95f4b', '#2e6b4f', '#7a9e7e',
  '#c98a2e', '#8f5b3a', '#4a7a96', '#a35d8f', '#6b6a60',
];

function setupCanvas(canvas, width, height) {
  const scale = 2;
  canvas.width = width * scale;
  canvas.height = height * scale;
  canvas.style.aspectRatio = `${width} / ${height}`;
  const ctx = canvas.getContext('2d');
  ctx.scale(scale, scale);
  return ctx;
}

export function drawDonut(canvas, slices, centreLabel) {
  const ctx = setupCanvas(canvas, 300, 300);
  const total = slices.reduce((sum, s) => sum + s.value, 0);
  const cx = 150;
  const cy = 150;
  const radius = 118;
  const inner = 72;
  if (total <= 0) {
    ctx.fillStyle = '#e4dcc9';
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();
  } else {
    let angle = -Math.PI / 2;
    slices.forEach((slice, i) => {
      const sweep = (slice.value / total) * Math.PI * 2;
      ctx.fillStyle = PALETTE[i % PALETTE.length];
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, angle, angle + sweep);
      ctx.closePath();
      ctx.fill();
      angle += sweep;
    });
  }
  ctx.fillStyle = '#fffdf7';
  ctx.beginPath();
  ctx.arc(cx, cy, inner, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#14382a';
  ctx.textAlign = 'center';
  ctx.font = 'bold 15px Georgia, serif';
  ctx.fillText('Spent', cx, cy - 14);
  ctx.font = 'bold 21px Georgia, serif';
  ctx.fillText(centreLabel, cx, cy + 10);
  ctx.font = '12px -apple-system, sans-serif';
  ctx.fillStyle = '#6b6a60';
  ctx.fillText('this month', cx, cy + 30);
}

export function donutColors(count) {
  return Array.from({ length: count }, (_, i) => PALETTE[i % PALETTE.length]);
}

export function drawTrend(canvas, months) {
  // months: [{ label, spent, saved }] — bars show spent, saved is printed below.
  const ctx = setupCanvas(canvas, 640, 260);
  const max = Math.max(...months.map((m) => m.spent), 1);
  const base = 220;
  const top = 24;
  const slot = 640 / months.length;
  const barWidth = Math.min(110, slot * 0.52);
  ctx.font = '13px -apple-system, sans-serif';
  months.forEach((month, i) => {
    const x = slot * i + (slot - barWidth) / 2;
    const height = Math.max(4, ((base - top) * month.spent) / max);
    const y = base - height;
    ctx.fillStyle = i === months.length - 1 ? '#1d4a38' : '#7a9e7e';
    ctx.fillRect(x, y, barWidth, height);
    ctx.fillStyle = '#14382a';
    ctx.textAlign = 'center';
    ctx.font = 'bold 15px Georgia, serif';
    ctx.fillText(`$${Math.round(month.spent).toLocaleString('en-US')}`, x + barWidth / 2, y - 8);
    ctx.font = '13px -apple-system, sans-serif';
    ctx.fillStyle = '#6b6a60';
    ctx.fillText(month.label, x + barWidth / 2, base + 20);
    ctx.fillStyle = '#2e7d54';
    ctx.fillText(`saved $${Math.round(month.saved).toLocaleString('en-US')}`, x + barWidth / 2, base + 38);
  });
  ctx.strokeStyle = '#e4dcc9';
  ctx.beginPath();
  ctx.moveTo(10, base);
  ctx.lineTo(630, base);
  ctx.stroke();
}
