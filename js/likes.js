const button = document.getElementById("likeButton")
const count = document.getElementById("likeCount")
const pathname = window.location.pathname
const durable_object = `https://jon-kuperman-do.jkup.workers.dev`

fetch(durable_object, {
  method: "POST",
  body: JSON.stringify({
    path: pathname.split("/")[1],
  }),
})
  .then(response => response.text())
  .then(data => {
    if (count) {
      count.innerText = data
    }
  })

if (button) {
  button.addEventListener("click", event => {
    event.preventDefault()
    fetch(durable_object, {
      method: "POST",
      body: JSON.stringify({
        path: pathname.split("/")[1],
        operation: "increment",
      }),
    })
      .then(response => response.text())
      .then(data => {
        count.innerText = data
      })
  })
}
