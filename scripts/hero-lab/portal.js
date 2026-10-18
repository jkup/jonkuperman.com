const CYAN = [139, 224, 231];
const IVORY = [236, 236, 220];
const AMBER = [242, 177, 113];
const rgba = (color, alpha) => `rgba(${color.join(',')},${alpha})`;

export function createScene() {
  let camera = 0;
  let destination = 0;
  let flash = 0;
  const spacing = 1.05;

  return {
    activate() {
      destination += spacing;
      flash = 1;
    },
    reset() {
      camera = 0;
      destination = 0;
      flash = 0;
    },
    render(ctx, frame) {
      const { width, height, pointer, reduced } = frame;
      if (!width || !height) return;
      const dt = Math.min(frame.dt || 0.016, 0.05);
      camera = reduced ? destination : camera + (destination - camera) * (1 - Math.exp(-dt * 4));
      flash = reduced ? 0 : Math.max(0, flash - dt * 0.8);
      const time = frame.time;
      const unit = Math.min(width * 0.34, height * 0.47);
      const centerX = width * 0.5;
      const centerY = height * 0.51;
      const viewX = (pointer?.x || 0) * 0.25;
      const viewY = (pointer?.y || 0) * 0.17;
      const first = Math.max(0, Math.floor(camera / spacing) - 1);
      const last = first + 11;

      const project = (x, y, z) => {
        const scale = 1.45 / Math.max(0.13, 1.45 + z);
        return {
          x: centerX + (x - viewX * (z + 0.5)) * unit * scale,
          y: centerY + (y - viewY * (z + 0.5)) * unit * scale,
          scale,
        };
      };
      const world = (x, y, z, rotation = 0) => {
        const sin = Math.sin(rotation);
        const cos = Math.cos(rotation);
        return project(x * cos - y * sin, x * sin + y * cos, z);
      };
      const line = (points, color, weight = 1) => {
        ctx.beginPath();
        points.forEach((p, i) => i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y));
        ctx.strokeStyle = color;
        ctx.lineWidth = weight;
        ctx.stroke();
      };
      const polygon = (points, fill, stroke, weight = 1) => {
        ctx.beginPath();
        points.forEach((p, i) => i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y));
        ctx.closePath();
        if (fill) { ctx.fillStyle = fill; ctx.fill(); }
        if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = weight; ctx.stroke(); }
      };

      // The light comes from the vanishing point; the foreground stays almost black.
      const vanishing = project(0, 0, 10);
      const haze = ctx.createRadialGradient(vanishing.x, vanishing.y, 0, centerX, centerY, unit * 1.8);
      haze.addColorStop(0, 'rgba(46, 123, 135, .19)');
      haze.addColorStop(0.3, 'rgba(28, 72, 84, .10)');
      haze.addColorStop(1, 'rgba(13, 17, 22, 0)');
      ctx.fillStyle = haze;
      ctx.fillRect(0, 0, width, height);

      const portalGeometry = (index) => {
        const z = index * spacing - camera + 0.16;
        const rotation = Math.sin(index * 0.81) * 0.037;
        const offsetX = Math.sin(index * 0.8) * 0.10;
        const offsetY = Math.cos(index * 0.7) * 0.035;
        const point = (x, y) => world(x + offsetX, y + offsetY, z, rotation);
        return {
          z, point,
          corners: [point(-1.65, -0.96), point(1.65, -0.96), point(1.65, 0.96), point(-1.65, 0.96)],
        };
      };

      // Continuous rails make the windows read as spaces you can pass through.
      for (let corner = 0; corner < 4; corner++) {
        const rail = [];
        for (let i = first; i <= last; i++) {
          const portal = portalGeometry(i);
          if (portal.z > -1.15) rail.push(portal.corners[corner]);
        }
        line(rail, rgba(corner < 2 ? CYAN : AMBER, 0.13), 0.75);
      }

      const drawFloatingWindow = (index, z, side) => {
        if (z < -1 || z > 8) return;
        const x = side * 0.97 + Math.sin(index * 1.7) * 0.12;
        const y = (side > 0 ? -0.06 : 0.19) + Math.sin(time * 0.55 + index) * 0.025;
        const w = side > 0 ? 0.69 : 1.08;
        const h = side > 0 ? 0.93 : 0.65;
        const yaw = side * -0.38;
        const tilt = side * 0.035;
        const p = (u, v) => world(x + u * Math.cos(yaw), y + v, z + u * Math.sin(yaw), tilt);
        const corners = [p(-w / 2, -h / 2), p(w / 2, -h / 2), p(w / 2, h / 2), p(-w / 2, h / 2)];
        const alpha = Math.min(0.94, 1 / (1 + Math.max(0, z) * 0.13));
        const accent = side > 0 ? AMBER : CYAN;
        polygon(corners, `rgba(12, 20, 27, ${alpha})`, rgba(accent, alpha * 0.50), 0.8);
        line([p(-w / 2, -h / 2 + 0.1), p(w / 2, -h / 2 + 0.1)], rgba(accent, alpha * 0.25), 0.65);
        for (let dot = 0; dot < 3; dot++) {
          const dotP = p(-w / 2 + 0.05 + dot * 0.037, -h / 2 + 0.048);
          ctx.beginPath();
          ctx.arc(dotP.x, dotP.y, Math.max(0.6, dotP.scale * unit * 0.008), 0, Math.PI * 2);
          ctx.fillStyle = rgba(dot === 0 ? accent : IVORY, alpha * 0.65);
          ctx.fill();
        }
        if (side > 0) {
          const inset = -w / 2 + 0.07;
          line([p(inset, -0.23), p(inset + w * 0.64, -0.23)], rgba(IVORY, alpha * 0.85), Math.max(1, unit * 0.018 * corners[0].scale));
          line([p(inset, -0.14), p(inset + w * 0.40, -0.14)], rgba(accent, alpha * 0.64), Math.max(0.8, unit * 0.012 * corners[0].scale));
          for (let row = 0; row < 6; row++) {
            const length = w * (row === 2 || row === 5 ? 0.47 : 0.78);
            line([p(inset, -0.01 + row * 0.055), p(inset + length, -0.01 + row * 0.055)], rgba(IVORY, alpha * 0.28), 0.7);
          }
          polygon([p(inset, 0.36), p(inset + 0.29, 0.36), p(inset + 0.29, 0.41), p(inset, 0.41)], rgba(accent, alpha * 0.25));
        } else {
          const snippets = ['> npm run dev', '  codex / workspace', '  ready in 12ms', '> build something_'];
          snippets.forEach((text, row) => {
            const anchor = p(-w / 2 + 0.055, -h / 2 + 0.2 + row * 0.087);
            const fontSize = unit * 0.046 * anchor.scale;
            if (fontSize > 3.8) {
              ctx.save();
              ctx.translate(anchor.x, anchor.y);
              ctx.rotate(tilt);
              ctx.font = `${fontSize}px ui-monospace, SFMono-Regular, Consolas, monospace`;
              ctx.fillStyle = rgba(row === 2 ? AMBER : row === 0 || row === 3 ? CYAN : IVORY, alpha * 0.9);
              ctx.fillText(text, 0, 0);
              ctx.restore();
            } else {
              line([anchor, p(-w / 2 + 0.055 + text.length * 0.023, -h / 2 + 0.2 + row * 0.087)], rgba(row === 2 ? AMBER : CYAN, alpha * 0.3), 0.6);
            }
          });
        }
      };

      for (let index = last; index >= first; index--) {
        const { z, point, corners } = portalGeometry(index);
        if (z < -1.15) continue;
        const alpha = Math.min(1, 1 / (1 + Math.max(0, z) * 0.42));
        // A solid browser chrome, open center, and offset glass edge distinguish each threshold.
        polygon([corners[0], corners[1], point(1.65, -0.76), point(-1.65, -0.76)], `rgba(14, 24, 31, ${alpha})`);
        ctx.save();
        ctx.shadowColor = rgba(CYAN, alpha * 0.4);
        ctx.shadowBlur = z < 1 ? 11 : 0;
        polygon(corners, null, rgba(index === first ? IVORY : CYAN, alpha * 0.72), z < 1 ? 1.3 : 0.85);
        ctx.restore();
        line([point(-1.65, -0.76), point(1.65, -0.76)], rgba(CYAN, alpha * 0.32), 0.7);
        line([point(-1.61, 0.92), point(1.61, 0.92), point(1.61, -0.72)], rgba(AMBER, alpha * 0.22), 0.7);
        for (let dot = 0; dot < 3; dot++) {
          const dotP = point(-1.52 + dot * 0.09, -0.86);
          ctx.beginPath();
          ctx.arc(dotP.x, dotP.y, Math.max(0.5, 0.024 * unit * dotP.scale), 0, Math.PI * 2);
          ctx.fillStyle = rgba(dot === 0 ? AMBER : IVORY, alpha * (dot === 0 ? 0.8 : 0.35));
          ctx.fill();
        }
        const address = point(-0.95, -0.83);
        if (address.scale * unit > 65) {
          ctx.font = `${Math.max(7, 0.065 * unit * address.scale)}px ui-monospace, SFMono-Regular, Consolas, monospace`;
          ctx.fillStyle = rgba(IVORY, alpha * 0.6);
          ctx.fillText(`workspace / ${String(index + 1).padStart(2, '0')}`, address.x, address.y);
        }

        // Floating applications sit between portals and pass alongside you on each dive.
        drawFloatingWindow(index, z + 0.35, index % 2 ? 1 : -1);
        if (index < first + 3) drawFloatingWindow(index + 2, z + 0.62, index % 2 ? -1 : 1);
      }

      // Fine pulses trace the room's floor, suggesting an active world beyond the window.
      if (!reduced) {
        for (let i = 0; i < 5; i++) {
          const depth = ((time * 0.35 + i * 1.9) % 10) + 0.2;
          const p = project((i % 2 ? 1 : -1) * 1.61, 0.94, depth);
          const q = project((i % 2 ? 1 : -1) * 1.61, 0.94, depth + 0.22);
          line([p, q], rgba(AMBER, 0.6 / (1 + depth * 0.2)), Math.max(0.8, p.scale * 1.3));
        }
      }
      if (flash > 0) {
        const glow = ctx.createRadialGradient(vanishing.x, vanishing.y, 0, vanishing.x, vanishing.y, unit * 1.3);
        glow.addColorStop(0, rgba(CYAN, flash * 0.07));
        glow.addColorStop(1, rgba(CYAN, 0));
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, width, height);
      }
    },
  };
}
