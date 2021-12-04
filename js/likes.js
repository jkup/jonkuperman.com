const button = document.getElementById("likeButton")
const likeBanner = document.getElementById("likeBanner")
const count = document.getElementById("likeCount")
const likeBannerCount = document.getElementById("likeBannerCount")
const pathname = window.location.pathname
const durable_object = `https://jon-kuperman-do.jkup.workers.dev`

function fetchAndUpdate(operation) {
  fetch(durable_object, {
    method: "POST",
    body: JSON.stringify({
      path: pathname.split("/")[1],
      ...(operation && { operation }),
    }),
  })
    .then(response => response.text())
    .then(data => {
      if (count) {
        count.innerText = `This post has ${data} likes`

        likeBannerCount.innerText = `(${data} likes)`
      }
    })
}

if (button) {
  button.addEventListener("click", handleClick)
}

if (likeBanner) {
  likeBanner.addEventListener("click", handleClick)
}

function handleClick(event) {
  event.preventDefault()
  fetchAndUpdate("increment")
}

fetchAndUpdate()
