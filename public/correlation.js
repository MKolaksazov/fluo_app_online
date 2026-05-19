
const labels = ['Продажби', 'Реклама', 'Цена', 'Клиенти', 'Рейтинг'];

const matrix = [
  [ 1.00,  0.82, -0.47,  0.91,  0.35],
  [ 0.82,  1.00, -0.23,  0.76,  0.18],
  [-0.47, -0.23,  1.00, -0.55, -0.62],
  [ 0.91,  0.76, -0.55,  1.00,  0.44],
  [ 0.35,  0.18, -0.62,  0.44,  1.00],
];

const N = labels.length;

function corrColor(v) {
  const a = Math.abs(v);
  if (v >= 0) return `rgba(255, 58, 58, ${a})`;
  return `rgba(26, 106, 255, ${a})`;
}

const heatmapPlugin = {
  id: 'heatmap',
  beforeDatasetsDraw(chart) {
    const { ctx, chartArea: ca } = chart;
    if (!ca) return;

    const cellW = (ca.right - ca.left) / N;
    const cellH = (ca.bottom - ca.top) / N;

    for (let row = 0; row < N; row++) {
      for (let col = 0; col < N; col++) {

        // Само долен триъгълник + диагонал
        if (col > row) continue;

        const val = matrix[row][col];
        const px = ca.left + col * cellW;
        const py = ca.top  + row * cellH;

        ctx.fillStyle = corrColor(val);
        ctx.fillRect(px + 1, py + 1, cellW - 2, cellH - 2);

        ctx.save();
        ctx.font = '11px JetBrains Mono, monospace';
        ctx.fillStyle = Math.abs(val) > 0.5 ? '#ffffff' : '#aaaaaa';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(val.toFixed(2), px + cellW / 2, py + cellH / 2);
        ctx.restore();
      }
    }

    // ── Означения на осите ──────────────────────────────────
    ctx.save();
    ctx.font = '600 12px JetBrains Mono, monospace';
    ctx.fillStyle = '#555';
    ctx.letterSpacing = '0.1em';

    // Ос X (хоризонтална) — под графиката, центрирана
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText('Променливи →', ca.left + (ca.right - ca.left) / 2, ca.bottom + 36);

    // Ос Y (вертикална) — вляво, завъртяна
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.translate(14, ca.top + (ca.bottom - ca.top) / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Променливи →', 0, 0);

    ctx.restore();
  }
};

const canvasCtx = document.getElementById('correlationChart').getContext('2d');

new Chart(canvasCtx, {
  type: 'scatter',
  plugins: [heatmapPlugin],
  data: {
    datasets: [{
      data: Array.from({ length: N }, (_, i) => ({ x: i, y: i })),
      pointRadius: 0,
      hoverRadius: 0,
    }]
  },
  options: {
    animation: false,
    responsive: true,
    maintainAspectRatio: true,
    layout: { padding: { left: 30, bottom: 55, top: 10, right: 10 } },
    scales: {
      x: {
        type: 'linear',
        min: -0.5,
        max: N - 0.5,
        ticks: {
          stepSize: 1,
          color: '#777',
          font: { family: 'JetBrains Mono', size: 11 },
          callback: v => Number.isInteger(v) ? (labels[v] ?? '') : '',
        },
        grid: { color: '#1a1a1a' },
        border: { color: '#222' }
      },
      y: {
        type: 'linear',
        min: -0.5,
        max: N - 0.5,
        reverse: true,
        ticks: {
          stepSize: 1,
          color: '#777',
          font: { family: 'JetBrains Mono', size: 11 },
          callback: v => Number.isInteger(v) ? (labels[v] ?? '') : '',
        },
        grid: { color: '#1a1a1a' },
        border: { color: '#222' }
      }
    },
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false }
    }
  }
});
