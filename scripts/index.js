const button = document.querySelector(".theme-toggle");

if (button) {
  const saved = localStorage.getItem("theme");
  const prefersDark = matchMedia("(prefers-color-scheme: dark)").matches;
  const theme = saved || (prefersDark ? "dark" : "light");

  document.documentElement.dataset.theme = theme;
  button.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");

  button.addEventListener("click", () => {
    const isDark = document.documentElement.dataset.theme === "dark";
    const next = isDark ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    button.setAttribute("aria-pressed", next === "dark" ? "true" : "false");
    localStorage.setItem("theme", next);
  });
}

// Hamburger menu functionality
const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".navigation nav ul");

if (menuToggle && navMenu) {
  menuToggle.addEventListener("click", () => {
    menuToggle.classList.toggle("active");
    navMenu.classList.toggle("active");
    const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", !isExpanded);
  });

  // Close menu when clicking a link
  const navLinks = navMenu.querySelectorAll("a");
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      menuToggle.classList.remove("active");
      navMenu.classList.remove("active");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });

  // Close menu when clicking outside
  document.addEventListener("click", (e) => {
    if (!menuToggle.contains(e.target) && !navMenu.contains(e.target)) {
      menuToggle.classList.remove("active");
      navMenu.classList.remove("active");
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });
}

// Latent-space heatmap in the homepage hero tile.
// Grid = every month since the first post (columns: years, rows: months).
// Cells with posts glow amber; an "attention" field drifts over the grid and
// follows the cursor. On load the cells resolve from noise into the data.
const heroCanvas = document.querySelector(".hero__canvas");

if (heroCanvas) {
  const ctx = heroCanvas.getContext("2d");
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let years = [];
  let grid = [];
  try {
    years = JSON.parse(heroCanvas.dataset.years || "[]");
    grid = JSON.parse(heroCanvas.dataset.grid || "[]");
  } catch (e) {}
  const COLS = Math.max(years.length, 1);
  const ROWS = 12;
  const maxCount = Math.max(1, ...grid.flat());

  let W = 0, H = 0, dpr = 1, cell = 0, ox = 0, oy = 0, t = 0;
  let mouse = null;
  const start = performance.now();

  const resize = () => {
    const rect = heroCanvas.getBoundingClientRect();
    dpr = Math.min(devicePixelRatio || 1, 2);
    W = heroCanvas.width = Math.max(1, Math.round(rect.width * dpr));
    H = heroCanvas.height = Math.max(1, Math.round(rect.height * dpr));
    if (W > H * 1.15) {
      // Wide tile: grid anchored to the right edge, text sits on the left.
      cell = Math.min(H / ROWS, (W * 0.44) / COLS);
      ox = W - cell * COLS - 24 * dpr;
      oy = (H - cell * ROWS) / 2;
    } else {
      // Narrow tile: grid across the top, text fades in below it.
      cell = Math.min((W - 48 * dpr) / COLS, (H * 0.28) / ROWS);
      ox = (W - cell * COLS) / 2;
      oy = 24 * dpr;
    }
  };

  const field = (i, j, t) =>
    Math.sin(i * 0.55 + t) * Math.cos(j * 0.41 - t * 0.7) +
    Math.sin((i + j) * 0.23 + t * 0.5) * 0.6;

  const palette = () =>
    document.documentElement.dataset.theme !== "light"
      ? { hot: "255,176,32", cool: "77,212,172", base: 0.22, boost: 1 }
      : { hot: "184,110,0", cool: "18,135,107", base: 0.16, boost: 0.8 };

  const draw = (now) => {
    const p = palette();
    const gap = Math.max(1, Math.round(cell * 0.14));
    // Load: 0 → 1 over 1.4s (instant under reduced motion).
    const load = reduceMotion ? 1 : Math.min(1, (now - start) / 1400);
    const ease = 1 - Math.pow(1 - load, 3);
    ctx.clearRect(0, 0, W, H);

    for (let i = 0; i < COLS; i++) {
      for (let j = 0; j < ROWS; j++) {
        const x = ox + i * cell;
        const y = oy + j * cell;
        const count = grid[i] ? grid[i][j] || 0 : 0;
        const data = Math.min(1, count / maxCount);
        const drift = (field(i, j, t) + 1.6) / 3.2; // 0..1
        let attention = drift * p.base;
        if (mouse) {
          const dx = (x + cell / 2 - mouse.x) / cell;
          const dy = (y + cell / 2 - mouse.y) / cell;
          attention += Math.exp(-(dx * dx + dy * dy) / 6) * 0.7;
        }
        // Resolve: early frames show pure drift noise, late frames show data.
        const noise = (field(j, i, t * 3 + i) + 1.6) / 3.2;
        const v = noise * (1 - ease) + data * ease;
        const a = Math.min(1, v * 0.9 + attention) * p.boost;
        ctx.fillStyle =
          v > 0.05
            ? `rgba(${p.hot},${a})`
            : `rgba(${p.cool},${Math.max(0.06, attention) * 0.9})`;
        ctx.fillRect(x, y, cell - gap, cell - gap);
      }
    }
  };

  const frame = (now) => {
    if (!document.hidden) {
      t += reduceMotion ? 0 : 0.006;
      draw(now);
    }
    if (!reduceMotion || now - start < 50) requestAnimationFrame(frame);
  };

  heroCanvas.parentElement.addEventListener("pointermove", (e) => {
    const r = heroCanvas.getBoundingClientRect();
    mouse = { x: (e.clientX - r.left) * dpr, y: (e.clientY - r.top) * dpr };
    if (reduceMotion) draw(performance.now());
  });
  heroCanvas.parentElement.addEventListener("pointerleave", () => {
    mouse = null;
    if (reduceMotion) draw(performance.now());
  });

  resize();
  addEventListener("resize", resize);
  if ("ResizeObserver" in window) new ResizeObserver(resize).observe(heroCanvas);
  requestAnimationFrame(frame);
}
