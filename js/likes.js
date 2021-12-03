const button = document.getElementById("likeButton")
fetch("/likes")
  .then(response => response.text())
  .then(data => {
    console.log(data)
  })
