import { createScene as browserScene } from './browser.js';
import { createScene as codeScene } from './code.js';
import { createScene as portalScene } from './portal.js';
import { createScene as gravityScene } from './gravity.js';

const factories = { browser: browserScene, code: codeScene, portal: portalScene, gravity: gravityScene };
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const motionButton = document.querySelector('#motion-control');
const grid = document.querySelector('#concepts');
let paused = reducedMotion.matches;
let animationFrame = 0;
let lastFrame = 0;
const demos = [];

function draw(demo, dt = 0) {
  if (!demo.width || !demo.height || demo.card.hidden) return;
  const pressed = demo.holding || demo.latched;
  demo.press = paused ? Number(pressed) : demo.press + (Number(pressed) - demo.press) * (1 - Math.exp(-dt * 7));
  const frame = {
    width: demo.width, height: demo.height, time: demo.time, dt,
    pointer: demo.pointer, hover: demo.pointer.active ? 1 : 0,
    pressed, press: demo.press, reduced: paused,
  };
  demo.ctx.clearRect(0, 0, demo.width, demo.height);
  demo.ctx.save();
  demo.scene.render(demo.ctx, frame);
  demo.ctx.restore();
}

function tick(now) {
  animationFrame = 0;
  if (paused || document.hidden) return;
  const dt = lastFrame ? Math.min((now - lastFrame) / 1000, .04) : 1 / 60;
  lastFrame = now;
  let active = false;
  for (const demo of demos) {
    if (!demo.visible || demo.card.hidden) continue;
    active = true;
    demo.time += dt;
    draw(demo, dt);
  }
  if (active) animationFrame = requestAnimationFrame(tick);
}

function start() {
  if (!animationFrame && !paused && !document.hidden) {
    lastFrame = 0;
    animationFrame = requestAnimationFrame(tick);
  }
}

function syncInput(demo) {
  demo.stage.classList.toggle('is-pressed', demo.holding || demo.latched);
  if (demo.id !== 'portal') demo.action.setAttribute('aria-pressed', String(demo.latched || demo.holding));
  if (paused) draw(demo);
  else start();
}

for (const card of document.querySelectorAll('[data-scene]')) {
  const canvas = card.querySelector('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    card.querySelector('.stage-hint').textContent = 'This browser does not support canvas.';
    continue;
  }
  const id = card.dataset.scene;
  const demo = {
    id, card, canvas, ctx, stage: card.querySelector('.stage'),
    action: card.querySelector('.interact'), scene: factories[id](),
    width: 0, height: 0, time: 0, press: 0, visible: false,
    holding: false, latched: false, pointer: { x: 0, y: 0, active: false },
  };
  demos.push(demo);
  card.querySelectorAll('button').forEach(button => { button.disabled = false; });
  new ResizeObserver(() => {
    const rect = demo.stage.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    demo.width = rect.width;
    demo.height = rect.height;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw(demo);
  }).observe(demo.stage);
  new IntersectionObserver(entries => {
    demo.visible = entries[0].isIntersecting;
    start();
  }, { threshold: 0 }).observe(demo.stage);

  function updatePointer(event) {
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    demo.pointer.x = Math.max(-1, Math.min(1, (event.clientX - rect.left) / rect.width * 2 - 1));
    demo.pointer.y = Math.max(-1, Math.min(1, (event.clientY - rect.top) / rect.height * 2 - 1));
    demo.pointer.active = true;
  }
  demo.stage.addEventListener('pointermove', event => { updatePointer(event); if (paused) draw(demo); });
  demo.stage.addEventListener('pointerdown', event => {
    if (event.button !== 0) return;
    updatePointer(event);
    demo.holding = true;
    demo.stage.setPointerCapture(event.pointerId);
    syncInput(demo);
  });
  function release(event) {
    demo.holding = false;
    if (event.pointerType === 'touch') demo.pointer.active = false;
    syncInput(demo);
  }
  demo.stage.addEventListener('pointerup', release);
  demo.stage.addEventListener('pointercancel', release);
  demo.stage.addEventListener('lostpointercapture', release);
  demo.stage.addEventListener('pointerleave', () => { demo.pointer.active = false; if (paused) draw(demo); });
  if (id === 'portal') demo.stage.addEventListener('click', () => { demo.scene.activate?.(); syncInput(demo); });
  demo.action.addEventListener('click', () => {
    if (id === 'portal') demo.scene.activate?.();
    else demo.latched = !demo.latched;
    syncInput(demo);
  });
  card.querySelector('.reset').addEventListener('click', () => {
    demo.scene.reset?.();
    demo.time = 0;
    demo.press = 0;
    demo.holding = demo.latched = false;
    demo.pointer = { x: 0, y: 0, active: false };
    syncInput(demo);
    draw(demo);
  });
}

function syncMotion() {
  motionButton.textContent = paused ? 'Play motion' : 'Pause motion';
  motionButton.setAttribute('aria-pressed', String(paused));
  if (paused && animationFrame) {
    cancelAnimationFrame(animationFrame);
    animationFrame = 0;
  }
  for (const demo of demos) draw(demo);
  start();
}
motionButton.disabled = false;
motionButton.addEventListener('click', () => { paused = !paused; syncMotion(); });
reducedMotion.addEventListener('change', () => { paused = reducedMotion.matches; syncMotion(); });
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    cancelAnimationFrame(animationFrame);
    animationFrame = 0;
  } else start();
});

for (const button of document.querySelectorAll('[data-view]')) {
  button.addEventListener('click', () => {
    const selected = button.dataset.view;
    grid.classList.toggle('solo', selected !== 'all');
    for (const demo of demos) demo.card.hidden = selected !== 'all' && selected !== demo.id;
    document.querySelectorAll('[data-view]').forEach(control => control.setAttribute('aria-pressed', String(control === button)));
    document.querySelector('#view-status').textContent = selected === 'all' ? 'Showing all four concepts.' : `Showing ${button.textContent.trim()} concept.`;
    start();
  });
}
syncMotion();
