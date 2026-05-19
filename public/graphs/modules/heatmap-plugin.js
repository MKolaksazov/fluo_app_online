const parametersList = [
    "Phi_Po",
    "Phi_Eo",
    "Psi_o",
    "Phi_Ro",
    "Phi_Do",
    "Pi_Abs",
    "ABS/RC",
    "TRo/RC",
    "ETo/RC",
    "DIo/RC",
    "Fo",
    "Fj",
    "Fi",
    "Fm",
    "Area",
    "Mo",
    "Fix Area",
    "HACH Area",
    "Vj",
    "Vi",
    "Bckg",
    "N",
    ];

var labels = [];
var N = parametersList.length;
//var matrix = []; 
//const N = labels.length;

function corrColor(v) {
  const a = Math.abs(v);
  return v >= 0
    ? `rgba(255, 58, 58, ${a})`
    : `rgba(26, 106, 255, ${a})`;
}

const heatmapPlugin = {
  id: 'heatmap',
  beforeDatasetsDraw(chart) {
// my code
    var transposedTable = transpose(tableData);
    var arrayParams = [];

    transposedTable.forEach(x => {
      if (parametersList.includes(x[0])) { arrayParams.push(x); labels.push(x[0]); }
    });

    N = arrayParams.length;
    var matrix = [...Array(N)].map(() => new Array(N).fill(1)); // Array.from({ length: N }, () => new Array(N).fill(1)); // also works!

    for (let i=0; i<N; i++) {
      for (let j=0; j<N; j++) {
        if (i!=j) {
          matrix[i][j] = jStat.spearmancoeff(arrayParams[i].slice(1, N), arrayParams[j].slice(1, N));
//console.log(i, j, 'jS', jStat.spearmancoeff(arrayParams[i].slice(1, N), arrayParams[j].slice(1, N)));
        }
      }
    }
console.log('m', matrix);
// end of my code
    const { ctx, chartArea: ca } = chart;
    if (!ca) return;

    const cellW = (ca.right - ca.left) / N;
    const cellH = (ca.bottom - ca.top) / N;

    // Динамичен размер на шрифта спрямо размера на клетката
    const fontSize = Math.max(24, Math.min(16, cellW * 0.18));

    for (let row = 0; row < N; row++) {
      for (let col = 0; col < N; col++) {

        // Само долен триъгълник + диагонал
        if (col > row) continue;
//console.log('m', matrix);
        const val = matrix[row][col];
        const px = ca.left + col * cellW;
        const py = ca.top  + row * cellH;

        // Клетка
        ctx.fillStyle = corrColor(val);
        ctx.fillRect(px + 1, py + 1, cellW - 2, cellH - 2);

        // Стойност — показва се само ако клетката е достатъчно голяма
        if (cellW > 30) {
          ctx.save();
          ctx.font = `${fontSize}px JetBrains Mono, monospace`;
          ctx.fillStyle = Math.abs(val) > 0.5 ? '#ffffff' : '#aaaaaa';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(val.toFixed(2), px + cellW / 2, py + cellH / 2);
          ctx.restore();
        }
      }
    }

    // ── Означения на осите (имената на променливите) ──────────
    // Вертикална ос: имената се показват завъртяно вляво от графиката
    // Хоризонтална ос: имената се показват под графиката

    const axisLabelFontSize = Math.max(9, Math.min(9, cellW * 0.15));
    //const axisLabelFontSize = Chart.defaults.font.size;

    ctx.save();
    ctx.font = `${axisLabelFontSize}px JetBrains Mono, monospace`;
    ctx.fillStyle = Chart.defaults.color; // '#888';

    // X ос — имената на колоните
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    for (let col = 0; col < N; col++) {
      const px = ca.left + col * cellW + cellW / 2;
      ctx.fillText(labels[col], px, ca.bottom + 6);
    }

    // ── Y ос — завъртяни на 90° надписи вляво ────────────────
    // ctx.save();
    // ctx.font = `${axisLabelFontSize}px JetBrains Mono, monospace`;
    // ctx.fillStyle = '#888';
    // ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (let row = 0; row < N; row++) {
      const py = ca.top + row * cellH + cellH / 2;
      const px = ca.left - 6;

      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText(labels[row], 0, 0);
      ctx.restore();
    }

    ctx.restore();

  }
};
