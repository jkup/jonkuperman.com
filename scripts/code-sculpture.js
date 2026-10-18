const TAU = Math.PI * 2;
const GLYPHS = '{}[]()<>=+-/*;.:&|_abcdefghijklmnopqrstuvwxyz01';
const SOURCE = 'async function route(request) { const stream = await render(); return cache.get(request.url) ?? stream; } <canvas /> export default app; ';
const ANGLES = 12;
const TILE = 24;
const ATLAS_COLUMNS = 48;
const clamp = (value, low = 0, high = 1) => Math.max(low, Math.min(high, value));
const smooth = value => value * value * (3 - 2 * value);

const THEMES = {
  dark: {
    glyphs: ['#718796', '#d8e6e3', '#fff7e5', '#ffd49c', '#a8f0f3'],
    surface: [10, 15, 20],
    surfaceLight: [32, 39, 42],
    shadow: 'rgba(0, 0, 0, 0.17)',
    aura: 'rgba(103, 164, 174, 0.037)',
  },
  light: {
    glyphs: ['#526b79', '#294858', '#123343', '#945323', '#1b6c87'],
    surface: [233, 236, 233],
    surfaceLight: [251, 248, 240],
    shadow: 'rgba(34, 58, 69, 0.09)',
    aura: 'rgba(114, 159, 170, 0.055)',
  },
};

function normalize(x, y, z) {
  const length = Math.hypot(x, y, z) || 1;
  return [x / length, y / length, z / length];
}

function surface(u, v) {
  // The trefoil is broad in the image plane; its three crossings carry real depth.
  const center = [
    (Math.sin(u) + 2 * Math.sin(2 * u)) / 3,
    (Math.cos(u) - 2 * Math.cos(2 * u)) / 3,
    -Math.sin(3 * u) * 0.4,
  ];
  const tangent = normalize(
    (Math.cos(u) + 4 * Math.cos(2 * u)) / 3,
    (-Math.sin(u) + 4 * Math.sin(2 * u)) / 3,
    -1.2 * Math.cos(3 * u),
  );
  const normal = normalize(tangent[1], -tangent[0], 0);
  const binormal = [
    -tangent[2] * normal[1],
    tangent[2] * normal[0],
    tangent[0] * normal[1] - tangent[1] * normal[0],
  ];
  const twist = v + Math.sin(u * 3) * 0.14;
  const cv = Math.cos(twist), sv = Math.sin(twist);
  const n = normal.map((value, axis) => value * cv + binormal[axis] * sv);
  const radius = 0.169 + Math.sin(u * 3 + 0.6) * 0.017;
  return { point: center.map((value, axis) => value + n[axis] * radius), normal: n };
}

function makeGeometry(longitudes, latitudes) {
  const vertices = [];
  const cells = [];
  for (let i = 0; i < longitudes; i += 1) {
    for (let j = 0; j < latitudes; j += 1) {
      const shape = surface(i / longitudes * TAU, j / latitudes * TAU);
      vertices.push({ point: shape.point, x: 0, y: 0 });
    }
  }
  for (let i = 0; i < longitudes; i += 1) {
    for (let j = 0; j < latitudes; j += 1) {
      const u = (i + 0.5) / longitudes * TAU;
      const v = (j + 0.5) / latitudes * TAU;
      const shape = surface(u, v);
      const char = SOURCE[(i + j * 19) % SOURCE.length];
      const glyph = Math.max(0, GLYPHS.indexOf(char === ' ' ? '.' : char));
      const index = cells.length;
      cells.push({
        ...shape,
        corners: [
          vertices[i * latitudes + j],
          vertices[((i + 1) % longitudes) * latitudes + j],
          vertices[((i + 1) % longitudes) * latitudes + (j + 1) % latitudes],
          vertices[i * latitudes + (j + 1) % latitudes],
        ],
        u, v, glyph, index,
        seam: j === Math.floor(latitudes * 0.58) ? 1 : j === Math.floor(latitudes * 0.74) ? 2 : j === Math.floor(latitudes * 0.9) ? 3 : 0,
        phase: (index * 2.399963229728653) % TAU,
        x: 0, y: 0, z: 0, nx: 0, ny: 0, nz: 0,
        dx: 0, dy: 0, vx: 0, vy: 0,
        perspective: 1,
      });
    }
  }
  return { vertices, cells, ordered: [...cells] };
}

function makeTextTargets() {
  const canvas = document.createElement('canvas');
  canvas.width = 600;
  canvas.height = 400;
  const context = canvas.getContext('2d', { willReadFrequently: true });
  context.font = '900 300px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
  context.textAlign = 'center';
  const metrics = context.measureText('jk.');
  const ascent = metrics.actualBoundingBoxAscent || 220;
  const descent = metrics.actualBoundingBoxDescent || 60;
  context.fillText('jk.', 300, 200 + (ascent - descent) / 2);
  const pixels = context.getImageData(0, 0, 600, 400).data;
  const targets = [];
  for (let y = 12; y < 388; y += 2) {
    for (let x = 12; x < 588; x += 2) {
      if (pixels[(y * 600 + x) * 4 + 3] > 150) targets.push([(x - 300) / 600, (y - 200) / 600]);
    }
  }
  return targets;
}

function makeAtlas(theme) {
  const colors = THEMES[theme].glyphs;
  const canvas = document.createElement('canvas');
  const count = GLYPHS.length * ANGLES * colors.length;
  canvas.width = ATLAS_COLUMNS * TILE;
  canvas.height = Math.ceil(count / ATLAS_COLUMNS) * TILE;
  const context = canvas.getContext('2d');
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.font = '600 15px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
  for (let color = 0; color < colors.length; color += 1) {
    context.fillStyle = colors[color];
    for (let angle = 0; angle < ANGLES; angle += 1) {
      for (let glyph = 0; glyph < GLYPHS.length; glyph += 1) {
        const index = (color * ANGLES + angle) * GLYPHS.length + glyph;
        const x = index % ATLAS_COLUMNS * TILE + TILE / 2;
        const y = Math.floor(index / ATLAS_COLUMNS) * TILE + TILE / 2;
        context.save();
        context.translate(x, y);
        context.rotate(angle / ANGLES * Math.PI - Math.PI / 2);
        context.fillText(GLYPHS[glyph], 0, 0.6);
        context.restore();
      }
    }
  }
  return canvas;
}

// A small software depth map only decides which side of a crossing is visible.
// Glyphs render after the whole mesh, so neighboring tiles never clip a letter.
function rasterizeDepth(a, b, c, buffer, columns, rows) {
  const minX = Math.max(0, Math.floor(Math.min(a.x, b.x, c.x) / 4));
  const maxX = Math.min(columns - 1, Math.floor(Math.max(a.x, b.x, c.x) / 4));
  const minY = Math.max(0, Math.floor(Math.min(a.y, b.y, c.y) / 4));
  const maxY = Math.min(rows - 1, Math.floor(Math.max(a.y, b.y, c.y) / 4));
  const denominator = (b.y - c.y) * (a.x - c.x) + (c.x - b.x) * (a.y - c.y);
  if (Math.abs(denominator) < 0.001) return;
  const inverse = 1 / denominator;
  for (let gy = minY; gy <= maxY; gy += 1) {
    const y = (gy + 0.5) * 4;
    for (let gx = minX; gx <= maxX; gx += 1) {
      const x = (gx + 0.5) * 4;
      const wa = ((b.y - c.y) * (x - c.x) + (c.x - b.x) * (y - c.y)) * inverse;
      const wb = ((c.y - a.y) * (x - c.x) + (a.x - c.x) * (y - c.y)) * inverse;
      const wc = 1 - wa - wb;
      if (wa >= -0.01 && wb >= -0.01 && wc >= -0.01) {
        const z = wa * a.z + wb * b.z + wc * c.z;
        const index = gy * columns + gx;
        if (z > buffer[index]) buffer[index] = z;
      }
    }
  }
}

export function createScene() {
  const desktop = makeGeometry(212, 18);
  const mobile = makeGeometry(156, 16);
  const textTargets = makeTextTargets();
  const atlases = {};
  let previousPress = 0;
  let arrivalTime = null;
  let frozenPointerX = 0;
  let frozenPointerY = 0;
  let depthBuffer = new Float32Array(0);

  return {
    reset() {
      previousPress = 0;
      arrivalTime = null;
      for (const geometry of [desktop, mobile]) {
        for (const p of geometry.cells) p.dx = p.dy = p.vx = p.vy = 0;
      }
    },

    render(ctx, frame) {
      const { width, height } = frame;
      if (!(width > 0 && height > 0)) return;
      const theme = frame.theme === 'light' ? 'light' : 'dark';
      const palette = THEMES[theme];
      const atlas = atlases[theme] || (atlases[theme] = makeAtlas(theme));
      const geometry = width < 430 ? mobile : desktop;
      const { vertices, cells, ordered } = geometry;
      const time = Number.isFinite(frame.time) ? frame.time : 0;
      const reduced = !!frame.reduced;
      const dt = reduced ? 0 : clamp(frame.dt || 0, 0, 0.04);
      const pointer = frame.pointer || { x: 0, y: 0, active: false };
      const press = clamp(frame.press || 0);
      const morph = smooth(press);
      if (arrivalTime === null) arrivalTime = time - (reduced ? 1.3 : 0);
      const arrival = smooth(clamp((time - arrivalTime) / 1.3));
      const size = Math.min(width * 0.408, height * 0.402);
      const centerX = width * 0.5;
      const centerY = height * 0.53;
      const textSize = Math.min(width * 1.03, height * 1.42);

      if (dt > 0) {
        const follow = 1 - Math.exp(-dt * 3.5);
        frozenPointerX += ((pointer.active ? pointer.x : 0) - frozenPointerX) * follow;
        frozenPointerY += ((pointer.active ? pointer.y : 0) - frozenPointerY) * follow;
      }

      const yaw = 0.16 + Math.sin(time * 0.17) * 0.22 + frozenPointerX * 0.1;
      const pitch = -0.1 + Math.sin(time * 0.13 + 0.7) * 0.16 + frozenPointerY * 0.08;
      const roll = -0.12 + Math.sin(time * 0.09) * 0.18;
      const cy = Math.cos(yaw), sy = Math.sin(yaw);
      const cp = Math.cos(pitch), sp = Math.sin(pitch);
      const cr = Math.cos(roll), sr = Math.sin(roll);
      const m00 = cr * cy - sr * sp * sy, m01 = -sr * cp, m02 = cr * sy + sr * sp * cy;
      const m10 = sr * cy + cr * sp * sy, m11 = cr * cp, m12 = sr * sy - cr * sp * cy;
      const m20 = -cp * sy, m21 = sp, m22 = cp * cy;
      const pointerX = centerX + pointer.x * width * 0.5;
      const pointerY = height * 0.5 + pointer.y * height * 0.5;
      const influence = Math.min(width, height) * 0.205;
      const released = dt > 0 ? Math.max(0, previousPress - press) : 0;
      previousPress = press;

      ctx.save();
      const aura = ctx.createRadialGradient(centerX, centerY, size * 0.35, centerX, centerY, size * 1.25);
      aura.addColorStop(0, palette.aura);
      aura.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = aura;
      ctx.fillRect(0, 0, width, height);

      for (const vertex of vertices) {
        const [x, y, z] = vertex.point;
        const depth = m20 * x + m21 * y + m22 * z;
        const perspective = 4.8 / (4.8 - depth);
        vertex.z = depth;
        vertex.x = centerX + (m00 * x + m01 * y + m02 * z) * size * perspective;
        vertex.y = centerY + (m10 * x + m11 * y + m12 * z) * size * perspective;
      }

      for (const p of cells) {
        const [x, y, z] = p.point;
        const [nx, ny, nz] = p.normal;
        const depth = m20 * x + m21 * y + m22 * z;
        const perspective = 4.8 / (4.8 - depth);
        const knotX = centerX + (m00 * x + m01 * y + m02 * z) * size * perspective;
        const knotY = centerY + (m10 * x + m11 * y + m12 * z) * size * perspective;
        const targetIndex = Math.floor(((p.index * 127) % cells.length) / cells.length * textTargets.length);
        const target = textTargets[targetIndex] || [0, 0];
        let screenX = knotX * (1 - morph) + (centerX + target[0] * textSize) * morph;
        let screenY = knotY * (1 - morph) + (centerY + target[1] * textSize) * morph;
        let forceX = 0, forceY = 0;
        if (pointer.active && dt > 0 && morph < 0.95) {
          const deltaX = screenX - pointerX, deltaY = screenY - pointerY;
          const distance = Math.hypot(deltaX, deltaY);
          const falloff = Math.max(0, 1 - distance / influence);
          const force = falloff * falloff * influence * 0.65 * (1 - morph);
          forceX = deltaX / (distance || 1) * force;
          forceY = deltaY / (distance || 1) * force;
        }
        if (dt > 0) {
          p.vx += (forceX - p.dx) * 58 * dt;
          p.vy += (forceY - p.dy) * 58 * dt;
          p.vx *= Math.exp(-8.8 * dt);
          p.vy *= Math.exp(-8.8 * dt);
          p.vx += (screenX - centerX) * released * 1.5;
          p.vy += (screenY - centerY) * released * 1.5;
          p.dx += p.vx * dt;
          p.dy += p.vy * dt;
        }
        // Arrival is already a complete silhouette; fine strands settle into place.
        const assemble = (1 - arrival) * (1 - morph);
        screenX += Math.cos(p.phase) * assemble * size * 0.085;
        screenY += Math.sin(p.phase) * assemble * size * 0.085;
        p.x = screenX + p.dx * (1 - morph);
        p.y = screenY + p.dy * (1 - morph);
        p.z = depth * (1 - morph);
        p.nx = m00 * nx + m01 * ny + m02 * nz;
        p.ny = m10 * nx + m11 * ny + m12 * nz;
        p.nz = m20 * nx + m21 * ny + m22 * nz;
        p.perspective = perspective * (1 - morph) + morph;
      }
      ordered.sort((a, b) => a.z - b.z);

      const baseGlyph = clamp(size * 0.043, 6.2, 8.4);
      const meshOpacity = (1 - morph) ** 3 * arrival;
      const dark = theme === 'dark';
      const depthColumns = Math.ceil(width / 4);
      const depthRows = Math.ceil(height / 4);
      const useDepth = morph < 0.03 && arrival > 0.9;
      if (depthBuffer.length !== depthColumns * depthRows) depthBuffer = new Float32Array(depthColumns * depthRows);
      if (useDepth) depthBuffer.fill(-Infinity);
      for (const p of ordered) {
        const facing = clamp((p.nz + 0.06) / 0.44);
        const diffuse = clamp(-p.nx * 0.42 - p.ny * 0.5 + p.nz * 0.75);
        const specular = clamp(-p.nx * 0.2 - p.ny * 0.36 + p.nz * 0.91) ** 12;
        const rim = (1 - Math.abs(p.nz)) ** 3;
        const wave = Math.max(0, Math.cos(p.u * 2 - time * 0.75 + p.v * 0.18)) ** 16;
        const light = clamp(diffuse * 0.78 + specular * 0.8 + wave * 0.52);
        const depth = clamp((p.z + 0.7) / 1.4);
        const displacement = Math.hypot(p.dx, p.dy);
        p.facing = facing;
        p.diffuse = diffuse;
        p.specular = specular;
        p.rim = rim;
        p.wave = wave;
        p.light = light;
        p.depth = depth;
        if (facing < 0.005 && morph < 0.01) continue;

        if (useDepth && facing > 0.02) {
          rasterizeDepth(p.corners[0], p.corners[1], p.corners[2], depthBuffer, depthColumns, depthRows);
          rasterizeDepth(p.corners[0], p.corners[2], p.corners[3], depthBuffer, depthColumns, depthRows);
        }

        if (meshOpacity > 0.015 && facing > 0.02) {
          const shade = light * 0.7 + depth * 0.2;
          const color = palette.surface.map((value, axis) => Math.round(value + (palette.surfaceLight[axis] - value) * shade));
          ctx.globalAlpha = meshOpacity * Math.max(0.15, 1 - displacement / 20);
          ctx.fillStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
          ctx.beginPath();
          ctx.moveTo(p.corners[0].x, p.corners[0].y);
          for (let i = 1; i < 4; i += 1) ctx.lineTo(p.corners[i].x, p.corners[i].y);
          ctx.closePath();
          ctx.fill();
        }

        if (p.seam && meshOpacity > 0.015 && facing > 0.02) {
          // Three strands catch the traveling light. Drawing each with its face
          // keeps the thread underneath the next crossing of the knot.
          const seamEnergy = 0.12 + diffuse * 0.24 + specular * 0.3 + wave * 0.65;
          ctx.globalAlpha = clamp(meshOpacity * facing * seamEnergy * (dark ? 0.95 : 0.48));
          ctx.strokeStyle = p.seam === 2 ? palette.glyphs[3] : p.seam === 3 ? palette.glyphs[4] : palette.glyphs[2];
          ctx.lineWidth = p.seam === 2 ? 0.8 : 0.55;
          ctx.beginPath();
          ctx.moveTo(p.corners[0].x, p.corners[0].y);
          ctx.lineTo(p.corners[1].x, p.corners[1].y);
          ctx.stroke();
        }
      }

      for (const p of ordered) {
        const { facing, diffuse, specular, rim, wave, light, depth } = p;
        if (facing < 0.005 && morph < 0.01) continue;
        if (useDepth) {
          const gx = Math.floor(p.x / 4), gy = Math.floor(p.y / 4);
          if (gx >= 0 && gx < depthColumns && gy >= 0 && gy < depthRows && p.z < depthBuffer[gy * depthColumns + gx] - 0.06) continue;
        }

        let color = light > 0.53 ? 2 : light > 0.24 ? 1 : 0;
        if (wave > 0.25 && p.v > 0.6) color = 3;
        else if (rim > 0.55 && p.nx > 0.12) color = 4;
        if (morph > 0.9) color = p.index % 29 === 0 ? 4 : p.index % 11 === 0 ? 3 : 2;
        const opacity = (0.36 + diffuse * 0.5 + specular * 0.33 + wave * 0.35 + rim * 0.16) * (0.72 + depth * 0.28);
        ctx.globalAlpha = clamp((opacity * facing * (1 - morph) + morph * (dark ? 0.87 : 0.79)) * (0.68 + arrival * 0.32));
        const tangentX = p.corners[1].x - p.corners[0].x;
        const tangentY = p.corners[1].y - p.corners[0].y;
        let angle = Math.atan2(tangentY, tangentX);
        if (angle > Math.PI / 2) angle -= Math.PI;
        if (angle < -Math.PI / 2) angle += Math.PI;
        angle *= 1 - morph;
        const angleIndex = Math.min(ANGLES - 1, Math.round((angle + Math.PI / 2) / Math.PI * ANGLES));
        const spriteIndex = (color * ANGLES + angleIndex) * GLYPHS.length + p.glyph;
        const sx = spriteIndex % ATLAS_COLUMNS * TILE;
        const sy = Math.floor(spriteIndex / ATLAS_COLUMNS) * TILE;
        const glyphSize = (baseGlyph * p.perspective * (1 - morph) + Math.max(4.4, baseGlyph * 0.71) * morph) * TILE / 15;
        ctx.drawImage(atlas, sx, sy, TILE, TILE, p.x - glyphSize / 2, p.y - glyphSize / 2, glyphSize, glyphSize);
      }

      ctx.globalAlpha = 1;
      ctx.restore();
    },
  };
}
