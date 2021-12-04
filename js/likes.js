const button = document.getElementById("likeButton")
const likeBanner = document.getElementById("likeBanner")
const count = document.getElementById("likeCount")
const likeBannerCount = document.getElementById("likeBannerCount")
const pathname = window.location.pathname
const durable_object = `https://jon-kuperman-do.jkup.workers.dev`

let likes = 0

if (button) {
  button.addEventListener("click", handleClick)
}

if (likeBanner) {
  likeBanner.addEventListener("click", handleClick)
}

function handleClick(event) {
  event.preventDefault()
  likes++
  debouncedHandler()
}

const debouncedHandler = debounce(() => fetchAndUpdate("increment"), 500)

function fetchAndUpdate(operation) {
  fetch(durable_object, {
    method: "POST",
    body: JSON.stringify({
      path: pathname.split("/")[1],
      ...(operation && { operation }),
      ...(likes && { likes }),
    }),
  })
    .then(response => response.text())
    .then(data => {
      if (count) {
        count.innerText = `This post has ${data} likes`

        likeBannerCount.innerText = `(${data} likes)`
      }
      likes = 0
    })
}

var functionDebounce = debounce

function debounce(fn, wait, callFirst) {
  var timeout = null
  var debouncedFn = null

  var clear = function () {
    if (timeout) {
      clearTimeout(timeout)

      debouncedFn = null
      timeout = null
    }
  }

  var flush = function () {
    var call = debouncedFn
    clear()

    if (call) {
      call()
    }
  }

  var debounceWrapper = function () {
    if (!wait) {
      return fn.apply(this, arguments)
    }

    var context = this
    var args = arguments
    var callNow = callFirst && !timeout
    clear()

    debouncedFn = function () {
      fn.apply(context, args)
    }

    timeout = setTimeout(function () {
      timeout = null

      if (!callNow) {
        var call = debouncedFn
        debouncedFn = null

        return call()
      }
    }, wait)

    if (callNow) {
      return debouncedFn()
    }
  }

  debounceWrapper.cancel = clear
  debounceWrapper.flush = flush

  return debounceWrapper
}

fetchAndUpdate()
