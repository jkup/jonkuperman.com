const button = document.getElementById("likeButton")
const likeBanner = document.getElementById("likeBanner")
const count = document.getElementById("likeCount")
const likeBannerCount = document.getElementById("likeBannerCount")
const pathname = window.location.pathname
const durable_object = `https://jon-kuperman-do.jkup.workers.dev`

let likeCount

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

function fetchAndUpdate(operation) {
  fetch(durable_object, {
    method: "POST",
    body: JSON.stringify({
      path: pathname.split("/")[1],
      ...(operation && { operation }),
    }),
  })
    .then(response => response.text())
    .then(result => {
      let data = JSON.parse(result)
      likeCount = data.likesInMemory
      renderData(data.likesInMemory, data.canLike, operation)
    })
}

function renderData(likes, canLike, operation) {
  if (count) {
    if (canLike) {
      count.innerText = `This post has ${likes} likes`
    } else if (operation) {
      count.innerText = `Thanks for liking this post! (${likes} likes)`
    } else {
      button.disabled = true
      count.innerText = `You've already liked this post (${likes} likes)`
    }
  }

  if (likeBannerCount) {
    if (canLike) {
      likeBannerCount.innerText = `Click here to like this post! (${likes} likes)`
    } else if (operation) {
      likeBannerCount.innerText = `Thanks for liking this post! (${likes} likes)`
    } else {
      likeBanner.disabled = true
      likeBannerCount.innerText = `You've already liked this post! (${likes} likes)`
    }
  }
}

fetchAndUpdate()
