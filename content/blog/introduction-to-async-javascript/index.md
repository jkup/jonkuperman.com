---
title: 'Introduction to async JavaScript'
date: '2021-02-10'
tags: ['JavaScript']
---

I had an awesome meeting with my mentee today and we covered a lot of great stuff!

-   **My awesome mentee**: Can we go over async await tomorrow?
-   **Me**: Absolutely!
-   **My awesome mentee**: Actually, maybe asynchronous code in general?
-   **Me**: Let's do it!

## A need for async

A situation a lot of new devs find themselves in is something like this:

> I have two things. I want the second one to start only after the first one is finished! How can I do that?

## Three options

When working with asynchronous code, you essentially have three architectural patterns you can choose from. We're going to cover all three. They are **callbacks**, **Promises** and **async/await**.

### Example code

Let's make a contrived example (but not too contrived!) so we can repeat it with all three approaches.

Let's say we're going to:

1. Fetch some data from an API
1. When it's finished fetching, populate an HTML list with the results one item at a time.

We'll start with some very basic HTML.

```html
<ul id="list"></ul>
```

Now we'll make each task a function like so:

```javascript
// Select the <ul> we made above
const list = document.getElementById('list');

// Make a list of same data. In this case, animals!
const animals = ['cat', 'dog', 'bird', 'fish', 'cow', 'sheep'];

// This function will go through the animals list and add a new item
// to the <ul> every 1 second.
function populateList(animals, index = 0) {
    setTimeout(() => {
        const animal = document.createElement('li');
        animal.innerText = animals[index];
        list.appendChild(animal);

        if (index < animals.length - 1) {
            populateList(animals, index + 1);
        }
    }, 1000);

    animateList();
}

// This function will toggle the visibility of the <ul> on and off
// creating a flashing animation!
function animateList() {
    let isVisible = true;
    setInterval(() => {
        list.style.visibility = isVisible ? 'hidden' : 'visible';
        isVisible = isVisible ? false : true;
    }, 2000);
}

populateList(animals, 0);
```

The problem here is the same as the one we defined above. Both `populateList` and `animateList` are working great. But we don't want the list to start animating until we are finished populating it!

Currently this isn't quite right. As you can see, we start flashing the list before it's fully populated!

![broken async javascript code](/broken-async-javascript.gif)

### Option 1, callbacks

The first approach we can take is passing `populateList` a callback function. We can make sure the callback function does not get called until the list is fully populated. That way we can write some code like:

```javascript
populateList(animals, 0, callbackFunction);

function callbackFunction() {
    // Now it's safe to call
    animateList();
}
```

We can even tidy it up a bit by making the callback function inline. This is the exact same code only inlined.

```javascript
populateList(animals, 0, () => {
    // Now it's safe to call
    animateList();
});
```

So with callbacks, our final code would look like:

```javascript
const list = document.getElementById('list');
const animals = ['cat', 'dog', 'bird', 'fish', 'cow', 'sheep'];

function populateList(animals, index = 0, callback) {
    setTimeout(() => {
        const animal = document.createElement('li');
        animal.innerText = animals[index];
        list.appendChild(animal);

        if (index < animals.length - 1) {
            // Notice we have to pass callback in each time we
            // call populateList
            populateList(animals, index + 1, callback);
        } else {
            // When we have no more populateList calls to make
            // Then we let the callback know we're finished!
            callback();
        }
    }, 1000);
}

function animateList() {
    let isVisible = true;
    setInterval(() => {
        list.style.visibility = isVisible ? 'hidden' : 'visible';
        isVisible = isVisible ? false : true;
    }, 2000);
}

populateList(animals, 0, () => {
    animateList();
});
```

And it's working!

![async javascript code](/async-javascript-code.gif)

### Option 2, Promises

The [Promise API](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) allows us to wrap async code in a `new Promise()` and then we can call `Promise.then` on it, passing in a function which will be executed only when the Promise is finished.

A simple example:

```javascript
const promise = new Promise((resolve, reject) => {
    setTimeout(() => resolve(), 1000);
});

promise.then(() => {
    // This code will only run when the setTimeout is finished
    console.log('we finished!');
});
```

With Promises, instead of passing in a custom callback function, we can just wrap the setTimeout in a Promise and call `resolve` when it's complete. This is very similar but it makes the execution cleaner. We go from:

```javascript
populateList(animals, 0, () => {
    animateList();
});
```

to

```javascript
populateList(animals, 0).then(() => {
    animateList();
});
```

We'll still have to wrap the setTimeout in a Promise though for this to work. And then we have to extract the list updating functionality to a separate function so we can call it over and over without invoking a new Promise each time. So our full example becomes:

```javascript
const list = document.getElementById('list');
const animals = ['cat', 'dog', 'bird', 'fish', 'cow', 'sheep'];

function populateList(animals, index = 0) {
    return new Promise((resolve) => {
        function updateList(animals, index) {
            setTimeout(() => {
                const animal = document.createElement('li');
                animal.innerText = animals[index];
                list.appendChild(animal);

                if (index < animals.length - 1) {
                    updateList(animals, index + 1);
                } else {
                    // When we have no more populateList calls to make
                    // Then we let the Promise know we're finished!
                    resolve();
                }
            }, 1000);
        }

        updateList(animals, index);
    });
}

function animateList() {
    let isVisible = true;
    setInterval(() => {
        list.style.visibility = isVisible ? 'hidden' : 'visible';
        isVisible = isVisible ? false : true;
    }, 2000);
}

populateList(animals, 0).then(() => {
    console.log('yay?');
});
```

It works again!

![async javascript code](/async-javascript-code.gif)

So, a little more heavy lifting up front but it does result in a nice clean API.

### Option 3, async/await

[Async functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) are a great way to work with asynchronous code in JavaScript! They allow you to "flatten" out your code so you aren't dealing with inline callback functions or `Promise.then` blocks! They make the callsite so nice and clean. It will look like:

```javascript
await populateList(animals, 0);
animateList();
```

It couldn't get cleaner than that! There's just one tiny caveat 😬

You can't call await without wrapping it in an async function. This means we'll have to wrap our previously "global" code in some kind of initialize function. Something like this will do.

```javascript
async function init() {
    await populateList(animals, 0);
    animateList();
}

init();
```

And we're in business!

The final code looks like:

```javascript
const list = document.getElementById('list');
const animals = ['cat', 'dog', 'bird', 'fish', 'cow', 'sheep'];

function populateList(animals, index = 0) {
    return new Promise((resolve) => {
        function updateList(animals, index = 0) {
            setTimeout(() => {
                const animal = document.createElement('li');
                animal.innerText = animals[index];
                list.appendChild(animal);

                if (index < animals.length - 1) {
                    updateList(animals, index + 1);
                } else {
                    // When we have no more populateList calls to make
                    // Then we let the Promise know we're finished!
                    resolve();
                }
            }, 1000);
        }

        updateList(animals, index);
    });
}

function animateList() {
    let isVisible = true;
    setInterval(() => {
        list.style.visibility = isVisible ? 'hidden' : 'visible';
        isVisible = isVisible ? false : true;
    }, 2000);
}

async function init() {
    await populateList(animals, 0);
    animateList();
}

init();
```

### Getting fancier

If we wanted to get super fancy we could abstract the `setTimeout` itself to a function.

```javascript
function timeout(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
```

And then we could `await` inside `populateList` itself like this!

```javascript
const list = document.getElementById('list');
const animals = ['cat', 'dog', 'bird', 'fish', 'cow', 'sheep'];

function timeout(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function populateList(animals, index = 0) {
    // Now we can await the entire timeout, no more nested inline functions!
    await timeout(1000);
    const animal = document.createElement('li');
    animal.innerText = animals[index];
    list.appendChild(animal);

    if (index < animals.length - 1) {
        return await populateList(animals, index + 1);
    } else {
        return true;
    }
}

function animateList() {
    let isVisible = true;
    setInterval(() => {
        list.style.visibility = isVisible ? 'hidden' : 'visible';
        isVisible = isVisible ? false : true;
    }, 2000);
}

async function init() {
    await populateList(animals, 0);
    animateList();
}

init();
```
