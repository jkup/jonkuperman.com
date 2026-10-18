const GOLD = '#e8c59a';
const ICE = '#91cfd4';
const INK = '#0d1116';

function roundedRect(ctx, x, y, width, height, radius = 5) {
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, radius);
}

function line(ctx, x1, y1, x2, y2) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function pill(ctx, x, y, width, height, fill, radius = 3) {
  roundedRect(ctx, x, y, width, height, radius);
  ctx.fillStyle = fill;
  ctx.fill();
}

function content(ctx, index, time) {
  const left = -110;
  ctx.fillStyle = '#dce5e8';
  ctx.font = '10px ui-monospace, SFMono-Regular, Consolas, monospace';
  ctx.textBaseline = 'middle';

  if (index === 5) {
    ctx.font = '26px Georgia, serif';
    ctx.fillStyle = '#f0e5d3';
    ctx.fillText('Hello, world.', left, -20);
    ctx.font = '9px ui-monospace, SFMono-Regular, Consolas, monospace';
    ctx.fillStyle = '#8d9da7';
    ctx.fillText('A little window. A lot underneath.', left, 4);
    pill(ctx, left, 24, 87, 23, 'rgba(232,197,154,0.14)');
    ctx.fillStyle = GOLD;
    ctx.fillText('Explore →', left + 12, 36);
    for (let i = 0; i < 3; i++) {
      pill(ctx, 3 + i * 39, 25, 30, 22, 'rgba(145,207,212,0.05)');
      ctx.strokeStyle = 'rgba(145,207,212,0.20)';
      line(ctx, 10 + i * 39, 31, 21 + i * 39, 40);
      line(ctx, 21 + i * 39, 31, 10 + i * 39, 40);
    }
    return;
  }

  if (index === 4) {
    for (let i = 0; i < 3; i++) {
      const x = left + i * 76;
      pill(ctx, x, -37, 65, 58, 'rgba(145,207,212,0.065)');
      ctx.strokeStyle = 'rgba(145,207,212,0.27)';
      roundedRect(ctx, x, -37, 65, 58, 3);
      ctx.stroke();
      pill(ctx, x + 9, -25, 24 + i * 7, 3, 'rgba(232,197,154,0.65)');
      pill(ctx, x + 9, -12, 44, 2, 'rgba(190,209,218,0.24)');
      pill(ctx, x + 9, -4, 33, 2, 'rgba(190,209,218,0.16)');
    }
    pill(ctx, left, 34, 217, 3, 'rgba(190,209,218,0.2)');
    pill(ctx, left, 44, 155, 3, 'rgba(190,209,218,0.12)');
  } else if (index === 3) {
    const snippets = ['<main>', '  <canvas aria-label="play" />', '  <article>hello</article>', '</main>'];
    snippets.forEach((text, i) => {
      ctx.fillStyle = i === 1 ? GOLD : 'rgba(184,211,218,0.7)';
      ctx.fillText(text, left, -29 + i * 21);
    });
  } else if (index === 2) {
    const nodes = [[-89, -21], [-5, -21], [79, -21], [-89, 36], [-5, 36], [79, 36]];
    ctx.strokeStyle = 'rgba(145,207,212,0.35)';
    nodes.forEach(([x, y], i) => {
      if (i < 2 || (i > 2 && i < 5)) line(ctx, x, y, x + 84, y);
      if (i < 3) line(ctx, x, y, x, y + 57);
    });
    nodes.forEach(([x, y], i) => {
      pill(ctx, x - 22, y - 13, 44, 26, '#14222a');
      ctx.strokeStyle = i === 1 ? GOLD : 'rgba(145,207,212,0.55)';
      roundedRect(ctx, x - 22, y - 13, 44, 26, 4);
      ctx.stroke();
      ctx.fillStyle = i === 1 ? GOLD : ICE;
      ctx.font = '8px ui-monospace, SFMono-Regular, Consolas, monospace';
      ctx.textAlign = 'center';
      ctx.fillText(['web', 'route', 'edge', 'cache', 'stream', 'data'][i], x, y);
      ctx.textAlign = 'left';
    });
  } else if (index === 1) {
    ctx.fillStyle = ICE;
    ctx.fillText('> ready', left, -31);
    ctx.fillStyle = 'rgba(198,215,222,0.55)';
    ctx.fillText('  stream connected', left, -10);
    ctx.fillText('  building something new_', left, 11);
    const progress = 0.6 + Math.sin(time * 0.8) * 0.12;
    pill(ctx, left, 34, 205, 3, 'rgba(145,207,212,0.12)');
    pill(ctx, left, 34, 205 * progress, 3, 'rgba(145,207,212,0.62)');
  } else {
    ctx.strokeStyle = 'rgba(145,207,212,0.16)';
    for (let x = -110; x <= 110; x += 22) line(ctx, x, -39, x, 49);
    for (let y = -39; y <= 49; y += 22) line(ctx, -110, y, 110, y);
    ctx.strokeStyle = GOLD;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let x = -110; x <= 110; x += 3) {
      const pulse = Math.exp(-((x - Math.sin(time * 0.7) * 55) ** 2) / 900);
      const y = 5 + Math.sin(x * 0.12 + time) * 22 * pulse;
      if (x === -110) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
}

export function createScene() {
  return {
    render(ctx, frame) {
      const { width, height, pointer, reduced } = frame;
      if (width <= 0 || height <= 0) return;
      const time = frame.time;
      const press = Math.max(0, Math.min(1, frame.press || 0));
      const entrance = reduced ? 0 : Math.exp(-Math.max(0, time) * 2.4);
      const expansion = Math.min(1, press + entrance * 0.55);
      const gap = 12 + expansion * 47;
      const yaw = -0.51 + (pointer?.x || 0) * 0.12;
      const pitch = 0.57 + (pointer?.y || 0) * 0.1;
      const roll = -0.13 + Math.sin(time * 0.22) * 0.025;
      const cy = Math.cos(yaw), sy = Math.sin(yaw);
      const cx = Math.cos(pitch), sx = Math.sin(pitch);
      const cz = Math.cos(roll), sz = Math.sin(roll);

      function project(x, y, z) {
        const rotatedX = x * cy + z * sy;
        const depth = -x * sy + z * cy;
        const rotatedY = y * cx + depth * sx;
        return { x: rotatedX * cz - rotatedY * sz, y: rotatedX * sz + rotatedY * cz };
      }

      const corners = [];
      for (const z of [-2.5 * gap, 2.5 * gap]) {
        for (const x of [-132, 132]) {
          for (const y of [-86, 86]) corners.push(project(x, y, z));
        }
      }
      const minX = Math.min(...corners.map(p => p.x));
      const maxX = Math.max(...corners.map(p => p.x));
      const minY = Math.min(...corners.map(p => p.y));
      const maxY = Math.max(...corners.map(p => p.y));
      const scale = Math.min((width - 50) / (maxX - minX), (height - 58) / (maxY - minY), 2);
      const centerX = width / 2;
      const centerY = height / 2 - 3;

      // A soft floor anchors the floating object without adding a second focal point.
      ctx.save();
      ctx.translate(centerX, height - 20);
      ctx.scale(Math.min(width * 0.3, 170), 13);
      const shadow = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
      shadow.addColorStop(0, 'rgba(145,207,212,0.10)');
      shadow.addColorStop(1, 'rgba(145,207,212,0)');
      ctx.fillStyle = shadow;
      ctx.fillRect(-1, -1, 2, 2);
      ctx.restore();

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.scale(scale, scale);
      const names = ['runtime', 'stream', 'routing', 'document', 'components', 'browser'];

      // Each layer is an affine projection of the same browser-sized glass pane.
      for (let i = 0; i < 6; i++) {
        const z = (i - 2.5) * gap;
        const origin = project(0, 0, z);
        const xAxis = project(1, 0, z);
        const yAxis = project(0, 1, z);
        ctx.save();
        ctx.transform(xAxis.x - origin.x, xAxis.y - origin.y, yAxis.x - origin.x, yAxis.y - origin.y, origin.x, origin.y);
        ctx.shadowColor = 'rgba(0,0,0,0.40)';
        ctx.shadowBlur = 12;
        ctx.shadowOffsetY = 8;
        roundedRect(ctx, -132, -86, 264, 172, 8);
        ctx.fillStyle = i === 5 ? 'rgba(16,23,30,0.95)' : `rgba(17,27,35,${0.76 + expansion * 0.12})`;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.shadowOffsetY = 0;

        const border = ctx.createLinearGradient(-132, -86, 132, 86);
        border.addColorStop(0, i === 5 ? '#ecd9b9' : 'rgba(145,207,212,0.7)');
        border.addColorStop(0.5, 'rgba(164,190,201,0.25)');
        border.addColorStop(1, i === 5 ? 'rgba(232,197,154,0.65)' : 'rgba(145,207,212,0.36)');
        ctx.strokeStyle = border;
        ctx.lineWidth = i === 5 ? 1.25 : 0.8;
        ctx.stroke();
        ctx.strokeStyle = 'rgba(183,206,215,0.12)';
        line(ctx, -132, -58, 132, -58);

        for (let dot = 0; dot < 3; dot++) {
          ctx.beginPath();
          ctx.arc(-116 + dot * 9, -72, 2.2, 0, Math.PI * 2);
          ctx.fillStyle = dot === 0 && i === 5 ? GOLD : 'rgba(160,184,195,0.35)';
          ctx.fill();
        }
        ctx.font = '8px ui-monospace, SFMono-Regular, Consolas, monospace';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = i === 5 ? '#c2ced4' : 'rgba(182,207,218,0.7)';
        ctx.fillText(names[i], -77, -72);
        ctx.fillStyle = 'rgba(170,197,208,0.3)';
        ctx.fillText('↗', 110, -72);
        content(ctx, i, time);
        ctx.restore();
      }

      // Opening the stack exposes one signal traveling through all six sheets.
      if (expansion > 0.02) {
        ctx.globalAlpha = expansion;
        const signal = Array.from({ length: 6 }, (_, i) => project(112, 66, (i - 2.5) * gap));
        ctx.strokeStyle = 'rgba(232,197,154,0.4)';
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 5]);
        ctx.beginPath();
        signal.forEach((point, i) => i ? ctx.lineTo(point.x, point.y) : ctx.moveTo(point.x, point.y));
        ctx.stroke();
        ctx.setLineDash([]);
        signal.forEach(point => {
          ctx.beginPath();
          ctx.arc(point.x, point.y, 3.5, 0, Math.PI * 2);
          ctx.fillStyle = INK;
          ctx.fill();
          ctx.strokeStyle = GOLD;
          ctx.stroke();
        });
        const travel = ((time * 0.8) % 5 + 5) % 5;
        const first = signal[Math.floor(travel)];
        const next = signal[Math.min(5, Math.floor(travel) + 1)];
        const mix = travel % 1;
        ctx.beginPath();
        ctx.arc(first.x + (next.x - first.x) * mix, first.y + (next.y - first.y) * mix, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#fff2d8';
        ctx.shadowColor = GOLD;
        ctx.shadowBlur = 12;
        ctx.fill();
      }
      ctx.restore();
    },
  };
}
