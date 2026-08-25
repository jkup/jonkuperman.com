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

// Latent-space heatmap in the homepage hero tile
const heroCanvas = document.querySelector(".hero__canvas");

if (heroCanvas && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const ctx = heroCanvas.getContext("2d");
  const N = 24;
  let W = 0;
  let H = 0;
  let t = 0;
  let cell = 0;

  const resize = () => {
    const rect = heroCanvas.getBoundingClientRect();
    const dpr = Math.min(devicePixelRatio || 1, 2);
    W = heroCanvas.width = Math.max(1, Math.round(rect.width * dpr));
    H = heroCanvas.height = Math.max(1, Math.round(rect.height * dpr));
    cell = W / N;
  };

  const field = (i, j, t) =>
    Math.sin(i * 0.55 + t) * Math.cos(j * 0.41 - t * 0.7) +
    Math.sin((i + j) * 0.23 + t * 0.5) * 0.6 +
    (i === j ? 1.2 : 0);

  const palette = () => {
    const dark = document.documentElement.dataset.theme !== "light";
    return dark
      ? { hot: "255,176,32", cool: "77,212,172", hotMul: 1, coolMul: 0.6 }
      : { hot: "184,110,0", cool: "18,135,107", hotMul: 0.55, coolMul: 0.3 };
  };

  const frame = () => {
    if (document.hidden) {
      requestAnimationFrame(frame);
      return;
    }
    t += 0.006;
    ctx.clearRect(0, 0, W, H);
    const gap = 2 * (devicePixelRatio || 1);
    const rows = Math.ceil(H / cell);
    const p = palette();
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < rows; j++) {
        const v = (field(i, j, t) + 2.2) / 4.4;
        const a = Math.pow(v, 2.4);
        ctx.fillStyle =
          v > 0.72
            ? `rgba(${p.hot},${a * p.hotMul})`
            : `rgba(${p.cool},${a * p.coolMul})`;
        ctx.fillRect(i * cell, j * cell, cell - gap, cell - gap);
      }
    }
    requestAnimationFrame(frame);
  };

  resize();
  addEventListener("resize", resize);
  requestAnimationFrame(frame);
}
