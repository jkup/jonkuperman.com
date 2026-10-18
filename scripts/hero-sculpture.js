import { createScene } from './code-sculpture.js';

const canvas = document.querySelector('.hero__canvas');
const ctx = canvas?.getContext('2d');

if (ctx) {
  const stage = canvas.closest('.hero__stage');
  const controls = document.querySelector('.hero__art-controls');
  const reveal = controls.querySelector('.hero__reveal');
  const motion = controls.querySelector('.hero__motion');
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const scene = createScene();
  const pointer = { x: 0, y: 0, active: false };
  let width = 0, height = 0, time = 0, press = 0;
  let holding = false, latched = false, visible = false;
  let heldPointer = null;
  let paused = preference.matches, frame = 0, last = 0;
  let theme = document.documentElement.dataset.theme || 'dark';

  function render(dt = 0) {
    if (!width || !height) return;
    ctx.clearRect(0, 0, width, height);
    ctx.save();
    scene.render(ctx, {
      width, height, time, dt, press, pointer, theme,
      pressed: holding || latched,
      hover: pointer.active ? 1 : 0,
      reduced: paused,
    });
    ctx.restore();
  }

  function stop() {
    cancelAnimationFrame(frame);
    frame = last = 0;
  }

  function tick(now) {
    frame = 0;
    if (paused || !visible || document.hidden) return;
    const dt = last ? Math.min((now - last) / 1000, .04) : 1 / 60;
    last = now;
    time += dt;
    press += (Number(holding || latched) - press) * (1 - Math.exp(-dt * 5));
    render(dt);
    frame = requestAnimationFrame(tick);
  }

  function start() {
    if (!frame && visible && !document.hidden && !paused) {
      last = 0;
      frame = requestAnimationFrame(tick);
    }
  }

  function syncInteraction() {
    const active = holding || latched;
    reveal.setAttribute('aria-pressed', String(active));
    stage.dataset.holding = String(active);
    if (paused) {
      press = Number(active);
      render();
    } else start();
  }

  function syncMotion() {
    motion.textContent = paused ? 'Play motion' : 'Pause motion';
    if (paused) stop();
    render();
    start();
  }

  function measure() {
    const rect = stage.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    width = rect.width;
    height = rect.height;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    render();
  }

  function movePointer(event) {
    // Pointer events can arrive before the first ResizeObserver measurement.
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    pointer.x = Math.max(-1, Math.min(1, (event.clientX - rect.left) / rect.width * 2 - 1));
    pointer.y = Math.max(-1, Math.min(1, (event.clientY - rect.top) / rect.height * 2 - 1));
    pointer.active = true;
  }

  stage.addEventListener('pointermove', event => {
    if (!event.isPrimary || (heldPointer !== null && event.pointerId !== heldPointer)) return;
    movePointer(event);
    if (paused) render();
  });
  stage.addEventListener('pointerdown', event => {
    if (!event.isPrimary || event.button !== 0) return;
    movePointer(event);
    holding = true;
    heldPointer = event.pointerId;
    stage.setPointerCapture(event.pointerId);
    syncInteraction();
  });
  function release(event) {
    if (event.pointerId !== heldPointer) return;
    heldPointer = null;
    holding = false;
    if (event.pointerType === 'touch') pointer.active = false;
    syncInteraction();
  }
  stage.addEventListener('pointerup', release);
  stage.addEventListener('pointercancel', release);
  stage.addEventListener('lostpointercapture', release);
  stage.addEventListener('pointerleave', () => {
    pointer.active = false;
    if (paused) render();
  });
  reveal.addEventListener('click', () => { latched = !latched; syncInteraction(); });
  motion.addEventListener('click', () => { paused = !paused; syncMotion(); });
  preference.addEventListener('change', () => { paused = preference.matches; syncMotion(); });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      holding = false;
      heldPointer = null;
      pointer.active = false;
      syncInteraction();
      stop();
    } else start();
  });
  window.addEventListener('blur', () => { holding = false; heldPointer = null; pointer.active = false; syncInteraction(); });
  new ResizeObserver(measure).observe(stage);
  new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    if (visible) start();
    else stop();
  }).observe(stage);
  new MutationObserver(() => {
    theme = document.documentElement.dataset.theme || 'dark';
    render();
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  controls.hidden = false;
  stage.dataset.ready = '';
  syncMotion();
  measure();
}
