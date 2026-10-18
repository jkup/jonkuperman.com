const TAU = Math.PI * 2;
const SOURCE = 'const dream = await create(); function build(idea) { return idea.map(makeReal); } <Codex /> export default curiosity; ';

function normalize(vector) {
  const length = Math.hypot(...vector) || 1;
  return vector.map(value => value / length);
}

function cross(a, b) {
  return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
}

function makeLetterTargets() {
  const canvas = document.createElement('canvas');
  canvas.width = 600;
  canvas.height = 400;
  const context = canvas.getContext('2d', { willReadFrequently: true });
  context.font = '900 300px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
  context.textAlign = 'center';
  const metrics = context.measureText('jk.');
  const baseline = 200 + (metrics.actualBoundingBoxAscent - metrics.actualBoundingBoxDescent) / 2;
  context.fillText('jk.', 300, baseline);
  const pixels = context.getImageData(0, 0, 600, 400).data;
  const targets = [];
  for (let y = 24; y < 380; y += 4) {
    for (let x = 20; x < 580; x += 4) {
      if (pixels[(y * 600 + x) * 4 + 3] > 128) targets.push([(x - 300) / 600, (y - 200) / 600]);
    }
  }
  return targets;
}

function makeParticles() {
  const particles = [];
  const turns = 125;
  const rings = 12;
  for (let i = 0; i < turns; i += 1) {
    const u = (i / turns) * TAU;
    const radius = 2 + 0.7 * Math.cos(3 * u);
    const center = [radius * Math.cos(2 * u), radius * Math.sin(2 * u), 0.9 * Math.sin(3 * u)];
    const tangent = normalize([
      -2.1 * Math.sin(3 * u) * Math.cos(2 * u) - 2 * radius * Math.sin(2 * u),
      -2.1 * Math.sin(3 * u) * Math.sin(2 * u) + 2 * radius * Math.cos(2 * u),
      2.7 * Math.cos(3 * u),
    ]);
    const normal = normalize(cross(tangent, [0, 0, 1]));
    const binormal = cross(tangent, normal);
    for (let j = 0; j < rings; j += 1) {
      const v = (j / rings) * TAU + u * 0.55;
      const thickness = 0.28 + 0.035 * Math.sin(u * 5);
      const point = center.map((value, axis) => (value + thickness * (Math.cos(v) * normal[axis] + Math.sin(v) * binormal[axis])) / 2.9);
      const index = particles.length;
      const sourceIndex = (i * 17 + j * 7) % SOURCE.length;
      particles.push({
        point,
        char: SOURCE[sourceIndex] === ' ' ? '·' : SOURCE[sourceIndex],
        accent: index % 31 === 0 ? 2 : index % 13 === 0 ? 1 : 0,
        phase: (index * 2.399963229728653) % TAU,
        dx: 0, dy: 0, vx: 0, vy: 0,
        x: 0, y: 0, z: 0, perspective: 1,
      });
    }
  }
  return particles;
}

export function createScene() {
  const particles = makeParticles();
  const targets = makeLetterTargets();
  const ordered = [...particles];
  let previousPress = 0;

  return {
    reset() {
      previousPress = 0;
      for (const particle of particles) {
        particle.dx = particle.dy = particle.vx = particle.vy = 0;
      }
    },

    render(ctx, frame) {
      const { width, height, pointer, reduced } = frame;
      const time = frame.time;
      const dt = Math.min(1 / 25, Math.max(1 / 120, frame.dt || 1 / 60));
      const press = Math.max(0, Math.min(1, frame.press || 0));
      const morph = press * press * (3 - 2 * press);
      const size = Math.min(width * 0.42, height * 0.43);
      const textSize = Math.min(width * 0.94, height * 1.43);
      const centerX = width * 0.5;
      const centerY = height * 0.48;
      const yaw = time * 0.13 + 0.45 + pointer.x * 0.12;
      const tilt = 0.82 + Math.sin(time * 0.21) * 0.18 + pointer.y * 0.08;
      const cy = Math.cos(yaw), sy = Math.sin(yaw);
      const cx = Math.cos(tilt), sx = Math.sin(tilt);
      const px = centerX + pointer.x * width * 0.5;
      const py = height * 0.5 + pointer.y * height * 0.5;
      const interactionRadius = Math.min(width, height) * 0.22;
      const released = Math.max(0, previousPress - press);
      previousPress = press;

      ctx.save();
      const aura = ctx.createRadialGradient(centerX, centerY, size * 0.15, centerX, centerY, size * 1.3);
      aura.addColorStop(0, `rgba(93, 149, 159, ${0.035 + morph * 0.035})`);
      aura.addColorStop(0.65, 'rgba(126, 159, 164, 0.025)');
      aura.addColorStop(1, 'rgba(126, 159, 164, 0)');
      ctx.fillStyle = aura;
      ctx.fillRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i += 1) {
        const p = particles[i];
        const [x, y, z] = p.point;
        const twist = Math.sin(time * 0.7 + p.phase) * 0.008;
        const rx = x * cy + z * sy;
        const rz = z * cy - x * sy;
        const ry = y * cx - rz * sx;
        const depth = y * sx + rz * cx;
        const perspective = 3.7 / (3.7 - depth);
        const target = targets[Math.floor((i * 0.61803398875 % 1) * targets.length)];
        const knotX = centerX + (rx + twist) * size * perspective;
        const knotY = centerY + ry * size * perspective;
        let screenX = knotX * (1 - morph) + (centerX + target[0] * textSize) * morph;
        let screenY = knotY * (1 - morph) + (centerY + target[1] * textSize) * morph;
        let forceX = 0, forceY = 0;
        if (pointer.active && !reduced && morph < 0.95) {
          const distanceX = screenX - px;
          const distanceY = screenY - py;
          const distance = Math.hypot(distanceX, distanceY);
          const weight = Math.max(0, 1 - distance / interactionRadius);
          if (weight > 0) {
            const force = weight * weight * interactionRadius * 0.58 * (1 - morph);
            forceX = (distanceX / (distance || 1)) * force;
            forceY = (distanceY / (distance || 1)) * force;
          }
        }
        if (!reduced) {
          p.vx += (forceX - p.dx) * 55 * dt;
          p.vy += (forceY - p.dy) * 55 * dt;
          p.vx *= Math.exp(-8 * dt);
          p.vy *= Math.exp(-8 * dt);
          if (released > 0) {
            p.vx += (screenX - centerX) * released * 1.3;
            p.vy += (screenY - centerY) * released * 1.3;
          }
          p.dx += p.vx * dt;
          p.dy += p.vy * dt;
        }
        p.x = screenX + p.dx * (1 - morph);
        p.y = screenY + p.dy * (1 - morph);
        p.z = depth * (1 - morph);
        p.perspective = perspective * (1 - morph) + morph;
      }

      ordered.sort((a, b) => a.z - b.z);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const fontSize = Math.max(7, Math.min(10.3, size * 0.058));
      let lastFont = '';
      for (const p of ordered) {
        const depthLight = Math.max(0, Math.min(1, (p.z + 1.1) / 2.2));
        const alpha = 0.2 + depthLight * 0.7 + morph * 0.16;
        const glyphSize = Math.round(fontSize * p.perspective * 2) / 2;
        const font = `${glyphSize}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
        if (lastFont !== font) { ctx.font = font; lastFont = font; }
        ctx.fillStyle = p.accent === 2
          ? `rgba(128, 220, 220, ${alpha})`
          : p.accent === 1
            ? `rgba(237, 185, 118, ${alpha})`
            : `rgba(231, 232, 221, ${alpha})`;
        ctx.fillText(p.char, p.x, p.y);
      }

      if (pointer.active && !reduced && morph < 0.7) {
        ctx.beginPath();
        ctx.arc(px, py, 3 + press * 3, 0, TAU);
        ctx.strokeStyle = `rgba(156, 219, 219, ${0.35 * (1 - morph)})`;
        ctx.lineWidth = 0.75;
        ctx.stroke();
      }
      ctx.restore();
    },
  };
}
