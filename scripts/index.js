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

// The mobile navigation is a disclosure; closed links cannot receive focus.
const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector("#primary-menu");

if (menuToggle && navMenu) {
  const mobileMenu = matchMedia("(max-width: 768px)");
  const setMenuOpen = (open, returnFocus = false) => {
    menuToggle.classList.toggle("active", open);
    navMenu.classList.toggle("active", open);
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    navMenu.inert = mobileMenu.matches && !open;
    if (returnFocus) menuToggle.focus();
  };
  setMenuOpen(false);
  mobileMenu.addEventListener("change", () => setMenuOpen(false));
  menuToggle.addEventListener("click", () => {
    const open = menuToggle.getAttribute("aria-expanded") !== "true";
    setMenuOpen(open);
    if (open) navMenu.querySelector("a")?.focus();
  });
  navMenu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => setMenuOpen(false, mobileMenu.matches));
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
      setMenuOpen(false, true);
    }
  });
  document.addEventListener("click", event => {
    if (!menuToggle.contains(event.target) && !navMenu.contains(event.target)) {
      setMenuOpen(false, navMenu.contains(document.activeElement));
    }
  });
  navMenu.addEventListener("focusout", event => {
    // Use the destination of the focus move: activeElement can temporarily be
    // the body while the browser is moving focus between two drawer controls.
    const next = event.relatedTarget;
    if (next && !navMenu.contains(next) && next !== menuToggle) setMenuOpen(false);
  });
}

// Code examples remain readable without JavaScript; controls enhance them.
document.querySelectorAll(".code-sample").forEach(sample => {
  const pre = sample.querySelector("pre");
  const copy = sample.querySelector(".code-copy");
  const status = sample.querySelector(".code-sample__status");
  const hint = sample.querySelector(".code-sample__hint");
  const updateOverflow = () => { hint.hidden = pre.scrollWidth <= pre.clientWidth + 1; };
  new ResizeObserver(updateOverflow).observe(pre);
  document.fonts.ready.then(updateOverflow);
  if (!navigator.clipboard?.writeText) return;
  copy.hidden = false;
  let resetLabel;
  copy.addEventListener("click", async () => {
    clearTimeout(resetLabel);
    try {
      await navigator.clipboard.writeText(pre.textContent);
      copy.textContent = "Copied";
      status.textContent = "Code copied to clipboard.";
    } catch {
      copy.textContent = "Try again";
      status.textContent = "Could not copy. You can select the code and copy it manually.";
    }
    resetLabel = setTimeout(() => { copy.textContent = "Copy"; status.textContent = ""; }, 3000);
  });
});

const printResume = document.querySelector(".resume__print");
if (printResume) {
  printResume.hidden = false;
  printResume.addEventListener("click", () => window.print());
}
