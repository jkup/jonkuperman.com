---
title: "Managing Immutable State with Object Spread"
date: "2019-12-01"
tags: ["JavaScript"]
---

There are a lot of great libraries for managing immutable state in your web apps. [Redux](https://redux.js.org/) and [Immer](https://immerjs.github.io/immer/) are two great examples.

When workings with libraries like these, you often need to create functions that take in the current state object and a piece of new data and return a new state object for which the only difference is the piece of new data.

Let's look at a quick example:

```javascript
const state = {
  users: [
    {
      id: 1,
      name: "User 1",
    },
    {
      id: 2,
      name: "User 2",
    },
  ],
  topics: [
    {
      id: 1,
      title: "Topic 1",
      description: "My first topic",
    },
    {
      id: 2,
      title: "Topic 2",
      description: "My second topic!",
    },
  ],
}

const newUser = {
  id: 3,
  name: "User 3",
}

const addUser = (state, newUser) => {
  state.users.push(newUser)
  return state
}
```

This works totally fine. But if we look at this line

```javascript
state.users.push(newUser)
```

We can see that we are **mutating** the state object, by pushing a new item onto the `users` array.

## Mutable vs Immutable

For those not familiar, let's take a look at what we mean by mutability. Say you have an array of numbers:

```javascript
const arr = [1, 2, 3, 4, 5]
```

And you want to add 1 to each number. You could do this by mutating or changing the existing array:

```javascript
const arr = [1, 2, 3, 4, 5]
for (let i = 0; i < arr.length; i++) {
  arr[i] = arr[i] + 1
}

console.log(arr) // [2, 3, 4, 5, 6]
```

Another approach we could take is to create a **new** array with our changes, while keeping the original one around. We can use a method like [Array.prototype.map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) to accomplish this.

```javascript
const arr = [1, 2, 3, 4, 5]
const newArr = arr.map(i => i + 1)

console.log(newArr) // [2, 3, 4, 5, 6]
console.log(arr) // [1, 2, 3, 4, 5]
```

The second approach is what we'd consider immutable as we never change (or mutate) the original array.

## Why have immutable state?

Many popular libraries encourage an **immutable** approach to state for a few reasons.

1. **Performance**. View libraries like React which compute changes can move a lot faster with immutable data structures.
1. **Undo**. Allowing users to "undo" an action is the holy grail of state management. With immmutable data structures, we can just keep the previous state around (or even just a log of state changes) and easily allow users to revert a change.
1. **Bugs**. There are a whole category of bugs that can be caused when mutating an object directly. An immutable approach ensures there is never invalid state and in the worst case state can always be reverted.
1. **Testability**. Immutable state changes are dead simple to test.

## Making the addUser function immutable with Object Spread

One great language feature for this type of work is the [spread syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax). This allows us to write really clean code for immutable state operations that generate new objects comprised mostly of values of the original object. Let's take a look at our `addUser` function again.

```javascript
const state = {
  users: [
    {
      id: 1,
      name: "User 1",
    },
    {
      id: 2,
      name: "User 2",
    },
  ],
  topics: [
    {
      id: 1,
      title: "Topic 1",
      description: "My first topic",
    },
    {
      id: 2,
      title: "Topic 2",
      description: "My second topic!",
    },
  ],
}

const newUser = {
  id: 3,
  name: "User 3",
}

const addUser = (state, newUser) => {
  return {
    ...state,
    users: [...state.users, newUser],
  }
}

const newState = addUser(state, newUser)
console.log(newState) // 3 users
console.log(state) // old state with 2 users
```
