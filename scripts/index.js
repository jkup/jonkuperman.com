const button = document.querySelector(".toggle")

const isDark =
  document.documentElement.dataset.theme === "dark" ||
  matchMedia("(prefers-color-scheme: dark)").matches

button.setAttribute("aria-pressed", isDark ? false : true)
document.documentElement.dataset.theme = isDark ? "dark" : "light"

const handleSync = () => {
  if (!document.startViewTransition) return sync()
  document.startViewTransition(sync)
}

const sync = () => {
  const darkNow = button.matches("[aria-pressed=false]")
  console.log(`was ${document.documentElement.dataset.theme}`)
  document.documentElement.dataset.theme = darkNow ? "light" : "dark"
  console.log(`now ${document.documentElement.dataset.theme}`)
  console.log(`Now with ${darkNow ? "Dark" : "Light"} Mode.`)
  button.setAttribute("aria-pressed", darkNow ? true : false)
}

button.addEventListener("click", handleSync)

// Hamburger menu functionality
const menuToggle = document.querySelector(".menu-toggle")
const navMenu = document.querySelector(".navigation nav ul")

if (menuToggle && navMenu) {
  menuToggle.addEventListener("click", () => {
    menuToggle.classList.toggle("active")
    navMenu.classList.toggle("active")
    const isExpanded = menuToggle.getAttribute("aria-expanded") === "true"
    menuToggle.setAttribute("aria-expanded", !isExpanded)
  })

  // Close menu when clicking a link
  const navLinks = navMenu.querySelectorAll("a")
  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      menuToggle.classList.remove("active")
      navMenu.classList.remove("active")
      menuToggle.setAttribute("aria-expanded", "false")
    })
  })

  // Close menu when clicking outside
  document.addEventListener("click", (e) => {
    if (!menuToggle.contains(e.target) && !navMenu.contains(e.target)) {
      menuToggle.classList.remove("active")
      navMenu.classList.remove("active")
      menuToggle.setAttribute("aria-expanded", "false")
    }
  })
}
