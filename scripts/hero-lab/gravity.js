const TAU = Math.PI * 2;

// A continuous weave on the homepage's folded surface, with a traveling release wave.
export function createScene() {
  let previousPressed = false;
  let releasedAt = -100;
  let releaseStrength = 0;
  let lastPress = 0;
  let leanX = 0;
  let leanY = 0;

  function reset() {
    previousPressed = false;
    releasedAt = -100;
    releaseStrength = lastPress = leanX = leanY = 0;
  }

  function render(ctx, { width: w, height: h, time, dt, pointer, pressed, press, reduced }) {
    if (previousPressed && !pressed) {
      releasedAt = time;
      releaseStrength = lastPress;
    }
    previousPressed = pressed;
    lastPress = press;
    const smoothing = reduced ? 1 : 1 - Math.exp(-dt * 4);
    leanX += ((pointer.active ? pointer.x : 0) - leanX) * smoothing;
    leanY += ((pointer.active ? pointer.y : 0) - leanY) * smoothing;
    const age = time - releasedAt;
    const energy = !reduced && age < 2.4 ? releaseStrength * Math.exp(-age * 1.6) : 0;
    const entrance = reduced ? 1 : Math.min(1, .65 + time * .4);
    const scale = Math.min(w * .255, h * .355) * entrance;
    const cx = w * .5, cy = h * .46;
    const shrink = 1 - .86 * press;
    const rotation = time * .13 + .58 + leanX * .34 + press * 1.7;
    const cr = Math.cos(rotation), sr = Math.sin(rotation);
    const lean = -.55 + leanY * .18, cl = Math.cos(lean), sl = Math.sin(lean);
    const glowRadius = scale * (1.5 - press * .95);
    const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(1, glowRadius));
    glow.addColorStop(0, `rgba(231,189,128,${.045 + press * .3 + energy * .08})`);
    glow.addColorStop(.38, `rgba(131,201,236,${.025 + press * .08})`);
    glow.addColorStop(1, 'rgba(131,201,236,0)');
    ctx.fillStyle = glow; ctx.fillRect(0, 0, w, h);

    function project(lat, angle) {
      const r = Math.cos(lat), z = Math.sin(lat);
      const fold = .29 * Math.sin(angle * 3 + z * 4.5 + Math.sin(time * .23) * .4) + .055 * Math.cos(angle * 5 - z * 3);
      const radius = r * (1 + fold * r);
      const twist = z * .7 + time * .035;
      let x = radius * Math.cos(angle + twist);
      let y = radius * Math.sin(angle + twist);
      let zz = z * .95 + .12 * r * r * Math.sin(angle * 3);
      const xx = x * cr - zz * sr;
      zz = x * sr + zz * cr;
      const yy = y * .46 - zz * .888;
      const depth = y * .888 + zz * .46;
      x = xx * cl - yy * sl;
      y = xx * sl + yy * cl;
      const distance = Math.hypot(x, y);
      const wave = energy * .4 * Math.exp(-Math.pow((distance - age * 2.5) * 4, 2));
      const spring = energy * Math.sin(age * 12) * .08;
      const perspective = 4 / (4 - depth);
      let px = x * (shrink + wave + spring);
      let py = y * (shrink + wave + spring);
      if (pointer.active && press < .4) {
        const tx = (w * .5 + pointer.x * w * .5 - cx) / (scale * perspective);
        const ty = (h * .5 + pointer.y * h * .5 - cy) / (scale * perspective);
        const d = Math.hypot(tx - px, ty - py);
        const attraction = Math.exp(-d * d * 2.7) * .25 * (1 - press);
        px += (tx - px) * attraction;
        py += (ty - py) * attraction;
      }
      return { x: cx + px * scale * perspective, y: cy + py * scale * perspective, z: depth };
    }

    const paths = Array.from({ length: 24 }, () => new Path2D());
    const ribbons = w < 450 ? 42 : 60;
    const steps = w < 450 ? 86 : 112;
    for (let row = 0; row < ribbons; row++) {
      const lat = -1.43 + row / (ribbons - 1) * 2.86;
      let previous = project(lat, 0);
      for (let step = 1; step <= steps; step++) {
        const p = project(lat, step / steps * TAU);
        const shade = Math.max(0, Math.min(23, Math.floor(((p.z + previous.z) * .5 + 1.5) / 3 * 24)));
        paths[shade].moveTo(previous.x, previous.y); paths[shade].lineTo(p.x, p.y);
        previous = p;
      }
    }
    // Sparse cross-strands give the fine latitudinal weave a tangible fabric structure.
    for (let column = 0; column < 24; column++) {
      let previous = project(-1.43, column / 24 * TAU);
      for (let step = 1; step <= 70; step++) {
        const p = project(-1.43 + step / 70 * 2.86, column / 24 * TAU);
        const shade = Math.max(0, Math.min(23, Math.floor(((p.z + previous.z) * .5 + 1.5) / 3 * 24)));
        paths[shade].moveTo(previous.x, previous.y); paths[shade].lineTo(p.x, p.y);
        previous = p;
      }
    }
    for (let shade = 0; shade < paths.length; shade++) {
      const front = shade / 23;
      const warmth = Math.max(0, (front - .45) / .55);
      const red = Math.round(112 + warmth * 128), green = Math.round(154 + warmth * 47), blue = Math.round(184 - warmth * 32);
      ctx.strokeStyle = `rgba(${red},${green},${blue},${.04 + front * front * .65 + press * .12})`;
      ctx.lineWidth = .45 + front * .45 + press * .3;
      ctx.stroke(paths[shade]);
    }

    if (energy > .015) {
      for (let i = 0; i < 52; i++) {
        const angle = i * 2.399963;
        const radius = scale * (.25 + age * (1.05 + (i % 7) * .085));
        const x = cx + Math.cos(angle) * radius, y = cy + Math.sin(angle) * radius * .85;
        ctx.strokeStyle = `rgba(${i % 4 ? '231,189,128' : '131,201,236'},${energy * .45})`;
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(x, y);
        ctx.lineTo(x + Math.cos(angle) * 8 * energy, y + Math.sin(angle) * 8 * energy);
        ctx.stroke();
      }
    }
    if (press > .5) {
      ctx.fillStyle = `rgba(248,226,185,${(press - .5) * .8})`;
      ctx.beginPath(); ctx.arc(cx, cy, 1.5 + press * 2, 0, TAU); ctx.fill();
    }
  }
  return { render, reset };
}
