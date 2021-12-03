const button = document.getElementById("likeButton")
const count = document.getElementById("likeCount")
const pathname = window.location.pathname

fetch("/likes", {
  method: "POST",
  body: JSON.stringify({
    path: pathname.split("/")[1],
  }),
})
  .then(response => response.text())
  .then(data => {
    count.innerText = data
  })
