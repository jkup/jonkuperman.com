---
title: "jquery vs node.js"
description: "The JavaScript ecosystem can be confusing! Let's compare two technologies that often get confused! What is the difference between jquery vs node.js?"
date: "2021-02-23"
tags: ["Tips"]
---

JavaScript has a vast ecosystem. Someone asked me on Twitter yesterday, what is the difference between jquery vs. node.js? They are very different technologies! It helps to take a step back and look at the entire JS ecosystem to explain the difference.

---

To make things even more complicated, JavaScript can run in the browser, on the server, or even on embedded devices! Running in so many different environments confuses people because it's challenging to separate JavaScript the language from a JavaScript platform.

## JavaScript the language

JavaScript, the language, came from humble origins. It was created in 1995 by Netscape and was initially named "Mocha." It saw rapid adoption in the first few years and was in clear need of management!

## ECMAScript

There is this incredible group called [Ecma International](https://www.ecma-international.org/).

> Ecma International is an industry association dedicated to the standardization of information and communication systems.

They help you form a standards body around a technology so members and vendors can join and help shape its future.

In 1997, two years after Netscape created the language, they partnered with ECMA. They formed ECMAScript, an official body of language contributors and vendors (like web browsers) who meet and decide on JavaScript's future together.

## jQuery

Flash forward ten years. ECMAScript is [struggling](https://auth0.com/blog/the-real-story-behind-es4/) to launch a new release of the language. Many of the browsers have given up and started creating their own, non-standard APIs. Web development is becoming increasingly difficult.

An engineer named [John Resig](https://twitter.com/jeresig) creates a JavaScript framework called [jQuery](https://jquery.com/). At its core, it's a bunch of JavaScript helper functions that hide away all the if/else checks web developers have to do between the browsers. It lets us add events, grab DOM elements, and make AJAX calls.

jQuery becomes ubiquitous for web development. Over the next ten years, it remains the gold standard for doing JavaScript work!

## Node.js

Around the same time, an engineer named Ryan Dahl announced an exciting project he had been working on. He called it [Node.js](https://nodejs.org/en/) and it is a:

> JavaScript runtime environment that runs on the V8 engine and executes JavaScript code outside a web browser.

To simplify, it allowed you to run JavaScript on the server! Previously JavaScript had only ever been used for front-end applications. Node.js took [v8](https://v8.dev/), Chrome's JavaScript engine out of Chrome, and turned it into a fast and exciting web server.

## jQuery vs node.js

While both technically use the JavaScript language. While jQuery is a front-end library that makes writing DOM selectors, event handlers, and AJAX easier to write cross-browser, node.js is a back-end runtime that lets you replace your Python, Ruby, or Java server with JavaScript!

The cool thing is that getting good with the JavaScript syntax will make you extra powerful now that you can use it for your back-end server and your front-end application!
