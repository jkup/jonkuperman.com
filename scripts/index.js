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
